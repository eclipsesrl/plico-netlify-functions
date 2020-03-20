import { FunctionHandler } from './utils/function-handler';
import 'reflect-metadata';
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
    return stripeHandler.handleGetSubscriptions(event);
  }
  if (event.httpMethod == 'POST') {
    return stripeHandler.handleCreateSubscription(event);
  }
};
