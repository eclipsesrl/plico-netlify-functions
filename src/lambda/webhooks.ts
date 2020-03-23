import { FunctionHandlerCallback } from './utils/function-handler';
import StripeWebhooksHandler from './stripe/webhooks.handler';

const stripeHandler = new StripeWebhooksHandler();

export const handler: FunctionHandlerCallback = (event, context, callback) => {
  stripeHandler.handle(event, context, callback);
};
