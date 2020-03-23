import { FunctionHandler } from './utils/function-handler';
import 'reflect-metadata';
import { OkResponse } from './utils/event-response';
import { getAmountWithTaxState } from './ecommerce/taxes';
import { CalculateCheckoutDTO } from './stripe/dto/calculate-checkout.dto';
import { validateAndTransformBack } from './utils/validate';
import { BadRequestException } from './utils/exceptions';
import { LITE_PRICES, PRO_PRICES } from './config/prices';

export const handler: FunctionHandler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const data = await validateAndTransformBack<CalculateCheckoutDTO>(
      CalculateCheckoutDTO,
      body
    );

    const prices =
      data.plan == 'lite'
        ? {
            regional: LITE_PRICES.eur,
            worldwide: LITE_PRICES.usd
          }
        : {
            regional: PRO_PRICES.eur,
            worldwide: PRO_PRICES.usd
          };

    const res = await getAmountWithTaxState(
      prices,
      data.country,
      data.state,
      data.tax_id
    );

    return OkResponse(res);
  } catch (e) {
    return BadRequestException(e.message);
  }
};
