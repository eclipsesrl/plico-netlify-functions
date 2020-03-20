import { FunctionHandler } from './utils/function-handler';
import { OkResponse } from './utils/event-response';
import { getAmountWithTaxState } from './ecommerce/taxes';
import { initFirebase } from './firebase';
import StripeHandler from './stripe/stripe.handler';

let app: any = null;
if (!app) {
  app = initFirebase();
}

let stripeHandler: StripeHandler = null;

if (!stripeHandler) {
  stripeHandler = new StripeHandler();
}

export const handler: FunctionHandler = async (event, context) => {
  if (event.httpMethod == 'GET') {
    return stripeHandler.handleGetCustomer(event);
  }
  if (event.httpMethod == 'POST') {
    return stripeHandler.handleCreateUpdateCustomer(event);
  }
};
