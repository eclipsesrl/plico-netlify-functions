import { UserService } from '../firebase/user/user.service';
import { AuthGuard } from '../firebase/auth.guard';
import { FunctionEventResponse, OkResponse } from '../utils/event-response';
import { FunctionEvent } from '../utils/event-type';
import {
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException
} from '../utils/exceptions';
import { User } from '../firebase/user/user.model';
import Stripe from 'stripe';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { validateAndTransformBack } from '../utils/validate';
import { getTaxState } from '../ecommerce/taxes';
import { AreaType, SaleState } from '../ecommerce/interfaces/sale-state';
import { UserPlan } from '../firebase/user/plan.enum';
import { UPGRADE_PRICES } from '../config/prices';

const secret =
  process.env.STRIPE_SECRET || 'sk_test_GjVfGheLn0iX1XuaWMAb6lvh00Qp4BmSHy';
const stripe = new Stripe(secret, null);

const countriesVat = {
  nz: 'nz_gst',
  au: 'au_abn',
  in: 'in_gst',
  no: 'no_vat',
  za: 'za_vat',
  ch: 'ch_vat',
  mx: 'mx_rfc',
  sg: 'sg_uen',
  ru: 'ru_inn',
  hk: 'hk_br',
  es: 'es_cif',
  tw: 'tw_vat',
  th: 'th_vat',
  jp: 'jp_cn',
  li: 'li_uid',
  us: 'us_ein',
  kr: 'kr_brn'
};

export default class StripeHandler {
  userService: UserService;
  auth: AuthGuard;

  constructor() {
    this.userService = new UserService();
    this.auth = new AuthGuard(this.userService);
  }

  async handleCreateSubscription(
    request: FunctionEvent
  ): Promise<FunctionEventResponse> {
    if (request.httpMethod !== 'POST') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }

    const is = await this.auth.isAuthenticated(request, true);

    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }
    const user = request.user as User;

    if (user.data.plan !== UserPlan.FREE) {
      return BadRequestException('YOU_HAVE_ALREADY_A_PLAN');
    }

    try {
      const body = JSON.parse(request.body);
      if (!body.plan) {
        return BadRequestException('MISSING_PLAN');
      }
      const plan = body.plan;
      delete body.plan;

      const modifications = body.modified ? body.modified : [];
      delete body.modified;
      if (!Array.isArray(modifications)) {
        return BadRequestException('INVALID_PARAM_MODIFIED');
      }

      const createSubData = await validateAndTransformBack<CreateCustomerDTO>(
        CreateCustomerDTO,
        {
          ...body,
          email: user.email
        }
      );

      const taxState = await getTaxState(
        createSubData.address.country,
        createSubData.address.state,
        createSubData.tax_id
      );
      const isRegional = taxState.area !== AreaType.WORLDWIDE;
      const customerData = this.getCustomerData(createSubData, isRegional);
      if (!user.data.stripeCustomerId) {
        const customer = await this.createCustomer(customerData, user.uid);
        return await this.createSubscription(
          customer.id,
          plan,
          taxState,
          user.uid
        );
      } else {
        if (modifications.length != 0) {
          await this.updateCustomer(
            customerData,
            user.data.stripeCustomerId,
            modifications
          );
        }
        return await this.createSubscription(
          user.data.stripeCustomerId,
          plan,
          taxState,
          user.uid
        );
      }
    } catch (e) {
      console.error(e.message);
      return BadRequestException(e.message || 'BAD');
    }
  }

  getTaxRate(taxState: SaleState) {
    return 'txr_1GOmENKUqUh9dmwo2Xa3ZgCb'; // TODO: populate get tax rate
  }

  async createSubscription(
    customerId: string,
    plan: string,
    taxState: SaleState,
    userId: string
  ) {
    plan = plan.toLowerCase();
    if (!['pro', 'lite'].includes(plan)) {
      return BadRequestException('INVALID_PLAN_CODE');
    }
    let subscriptionPlan: string = plan + '_plan';
    let taxRate = '';
    if (taxState.area == AreaType.WORLDWIDE) {
      subscriptionPlan += '_usd';
      taxRate = null;
    } else {
      taxRate = this.getTaxRate(taxState);
    }
    const subData: any = {
      customer: customerId,
      items: [{ plan: subscriptionPlan }],
      expand: ['latest_invoice.payment_intent']
    };
    if (taxRate) {
      subData.default_tax_rates = [taxRate];
    }
    subData.metadata = {
      uid: userId
    };
    const subscription = await stripe.subscriptions.create(subData);
    return OkResponse(subscription);
  }

  getTypeOfTaxId(country: string, regional: boolean): string {
    country = country.toLowerCase();

    //@ts-ignore
    if (countriesVat[country]) {
      //@ts-ignore
      return countriesVat[country] as string;
    }
    if (regional) {
      return 'eu_vat';
    }
    return '';
  }

  getCustomerData(createCustomer: CreateCustomerDTO, regional: boolean) {
    const data: any = {
      email: createCustomer.email,
      address: createCustomer.address,
      name: createCustomer.name || '',
      payment_method: createCustomer.payment_method,
      invoice_settings: {
        default_payment_method: createCustomer.payment_method
      }
    };
    if (createCustomer.tax_id) {
      if (!data.metadata) {
        data.metadata = {};
      }
      data.metadata.tax_id = createCustomer.tax_id;
      const taxId = this.getTypeOfTaxId(
        createCustomer.address.country,
        regional
      );
      if (taxId && taxId != '') {
        data.tax_id_data = [{ type: taxId, value: createCustomer.tax_id }];
      }
    }
    if (createCustomer.codice_univoco) {
      if (!data.metadata) {
        data.metadata = {};
      }
      data.metadata.codice_univoco = createCustomer.codice_univoco;
    }

    return data;
  }

  async handleGetCustomer(
    request: FunctionEvent
  ): Promise<FunctionEventResponse> {
    if (request.httpMethod !== 'GET') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }

    const is = await this.auth.isAuthenticated(request, true);

    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }
    const user = request.user as User;

    if (!user.data.stripeCustomerId) {
      return BadRequestException('MISSING_CUSTOMER_ID');
    }

    const customer = await this.getCustomer(user.data.stripeCustomerId);
    return OkResponse(customer);
  }

  async updateCustomer(
    customerData: any,
    customerUid: string,
    modifications: string[] = []
  ) {
    const source = customerData.payment_method;
    if (customerData.payment_method) {
      delete customerData.payment_method;
    }
    const tax_ids = customerData.tax_id_data;
    if (tax_ids) {
      delete customerData.tax_id_data;
    }

    await stripe.paymentMethods.attach(source, { customer: customerUid });

    if (tax_ids.length == 1 && modifications.includes('tax_ids')) {
      const taxIds = await stripe.customers.listTaxIds(customerUid, {
        limit: 1
      });
      if (taxIds.data.length == 1) {
        const attachedTax = taxIds.data[0];
        if (attachedTax.value !== tax_ids[0].value) {
          await stripe.customers.deleteTaxId(customerUid, attachedTax.id);
          await stripe.customers.createTaxId(customerUid, tax_ids[0]);
        }
      } else if (taxIds.data.length == 0) {
        await stripe.customers.createTaxId(customerUid, tax_ids[0]);
      }
    }

    const customer = await stripe.customers.update(customerUid, customerData);
    return this.mapCustomerData(customer);
  }

  async createOrUpdateCustomer(user: User, data: any) {
    const createSubData = await validateAndTransformBack<CreateCustomerDTO>(
      CreateCustomerDTO,
      {
        ...data,
        email: user.email
      }
    );

    const taxState = await getTaxState(
      createSubData.address.country,
      createSubData.address.state,
      createSubData.tax_id
    );
    const isRegional = taxState.area !== AreaType.WORLDWIDE;
    const customerData = this.getCustomerData(createSubData, isRegional);

    let customer;
    if (!user.data.stripeCustomerId) {
      customer = await this.createCustomer(customerData, user.uid);
    } else {
      customer = await this.updateCustomer(
        customerData,
        user.data.stripeCustomerId
      );
    }

    return customer;
  }

  async handleCreateUpdateCustomer(
    request: FunctionEvent
  ): Promise<FunctionEventResponse> {
    if (request.httpMethod !== 'POST') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }
    const is = await this.auth.isAuthenticated(request, true);

    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }
    const user = request.user as User;

    const customer = await this.createOrUpdateCustomer(
      user,
      JSON.parse(request.body)
    );

    return OkResponse(customer);
  }

  mapCustomerData(customer: Stripe.Customer) {
    const customerData = {
      id: customer.id,
      address: customer.address || {},
      email: customer.email,
      subscriptions: customer.subscriptions.data.map(sub => {
        return {
          id: sub.id,
          invoice: sub.latest_invoice,
          plan: sub.plan,
          current_period_end: sub.current_period_end,
          current_period_start: sub.current_period_start,
          days_until_due: sub.days_until_due,
          status: sub.status,
          metadata: sub.metadata
        };
      }),
      tax_ids: customer.tax_ids.data
    };
    return customerData;
  }

  async getCustomer(customerId: string) {
    try {
      const customer = (await stripe.customers.retrieve(
        customerId
      )) as Stripe.Customer;
      return this.mapCustomerData(customer);
    } catch (e) {
      console.error(e.message);
      return {};
    }
  }

  async createCustomer(customerDataDTO: any, uid: string) {
    const tax_ids = customerDataDTO.tax_id_data;
    if (tax_ids) {
      delete customerDataDTO.tax_id_data;
    }
    const customer = await stripe.customers.create(customerDataDTO);
    if (tax_ids) {
      tax_ids.forEach(async (tax: any) => {
        await stripe.customers.createTaxId(customer.id, tax);
      });
    }

    await this.userService.addStripeCustomerId(customer.id, uid);
    return this.mapCustomerData(customer);
  }

  async handleUpgradeSubscription(
    request: FunctionEvent
  ): Promise<FunctionEventResponse> {
    if (request.httpMethod !== 'GET') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }

    const is = await this.auth.isAuthenticated(request, true);

    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }
    const user = request.user as User;
    if (user.data.plan !== UserPlan.LITE) {
      return UnauthorizedException('ONLY_LITE_CAN_UPGRADE');
    }
    const customerId = user.data.stripeCustomerId;
    if (!customerId) {
      return UnauthorizedException('ONLY_CUSTOMERS_CAN_UPGRADE');
    }

    try {
      const body = JSON.parse(request.body);

      const modifications = body.modified ? body.modified : [];
      delete body.modified;
      if (!Array.isArray(modifications)) {
        return BadRequestException('INVALID_PARAM_MODIFIED');
      }

      const createSubData = await validateAndTransformBack<CreateCustomerDTO>(
        CreateCustomerDTO,
        {
          ...body,
          email: user.email
        }
      );

      const taxState = await getTaxState(
        createSubData.address.country,
        createSubData.address.state,
        createSubData.tax_id
      );
      const isRegional = taxState.area !== AreaType.WORLDWIDE;
      const customerData = this.getCustomerData(createSubData, isRegional);
      if (modifications.length != 0) {
        await this.updateCustomer(
          customerData,
          user.data.stripeCustomerId,
          modifications
        );
      }

      const sub = await stripe.subscriptions.list({
        limit: 1,
        status: 'active',
        customer: customerId
      });
      const subscription = sub.data[0];
      if (!subscription) {
        return UnauthorizedException(
          'ONLY_CUSTOMERS_WITH_REAL_SUBSCRIPTION_CAN_UPGRADE'
        );
      }
      const plan_id = isRegional ? 'pro_plan' : 'pro_plan_usd';
      const amount = isRegional
        ? (1.0 + taxState.rate) * UPGRADE_PRICES.eur
        : UPGRADE_PRICES.usd;
      const currency = isRegional ? 'eur' : 'usd';

      const result = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata: {
          upgrade: 'true',
          subscription: subscription.id,
          plan_id
        }
      });

      return OkResponse({
        client_secret: result.client_secret
      });
    } catch (e) {
      return UnauthorizedException(
        'ONLY_CUSTOMERS_WITH_REAL_SUBSCRIPTION_CAN_UPGRADE'
      );
    }
  }

  async handleGetSubscriptions(
    request: FunctionEvent
  ): Promise<FunctionEventResponse> {
    if (request.httpMethod !== 'GET') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }

    const is = await this.auth.isAuthenticated(request, true);

    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }

    const user = request.user as User;
    if (!user.data.stripeCustomerId) {
      return OkResponse([]);
    }

    const customerId = user.data.stripeCustomerId;
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId
      });
      const subscriptionsData = subscriptions.data.map(sub => {
        return {
          id: sub.id,
          invoice: sub.latest_invoice,
          plan: sub.plan,
          current_period_end: sub.current_period_end,
          current_period_start: sub.current_period_start,
          days_until_due: sub.days_until_due,
          status: sub.status,
          metadata: sub.metadata
        };
      });
      return OkResponse(subscriptionsData || []);
    } catch (e) {
      console.error(e.message);
      return InternalServerErrorException(e);
    }
  }
}
