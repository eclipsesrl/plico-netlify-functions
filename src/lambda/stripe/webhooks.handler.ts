import Stripe from 'stripe';
import { FunctionEvent } from '../utils/event-type';
import { UserService } from '../firebase/user/user.service';
import { initFirebase } from '../firebase/index';
import { UserPlan } from '../firebase/user/plan.enum';

const secret =
  process.env.STRIPE_SECRET || 'sk_test_GjVfGheLn0iX1XuaWMAb6lvh00Qp4BmSHy';
const stripe = new Stripe(secret, null);

const endpointSecret =
  process.env.STRIPE_WEBHOOKS_SECRET ||
  'whsec_SPUnz5cLG2uh6OFoFTaYZp5SpiKnf4Pm';

export default class StripeWebhooksHandler {
  userService: UserService;
  constructor() {
    initFirebase();
    this.userService = new UserService();
  }

  handle(request: FunctionEvent, context: any, callback: Function) {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      callback(err, { statusCode: 400, body: err.message });
    }

    switch (event.type) {
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ received: true })
        });
        const planId = subscription.plan.id;

        const customerId = subscription.customer as string;
        const plan = planId.split('_')[0];

        if (subscription.status == 'active') {
          switch (plan.toLowerCase()) {
            case 'pro':
              this.userService
                .updateCustomerPlan(customerId, UserPlan.PRO)
                .then(() => {
                  console.log('Updated subscription');
                });
              break;
            case 'lite':
              this.userService
                .updateCustomerPlan(customerId, UserPlan.LITE)
                .then(() => {
                  console.log('Updated subscription');
                });
              break;
            default: {
              console.log(`Error, subscription invalid: ${plan}`);
            }
          }
        } else {
          this.userService
            .updateCustomerPlan(customerId, UserPlan.FREE)
            .then(() => {
              console.log('Updated subscription');
            });
        }
        break;
      }
      case 'payment_intent.succeeded': {
        const payment_intent = event.data.object as Stripe.PaymentIntent;
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ received: true })
        });
        if (
          payment_intent.metadata.upgrade == 'true' &&
          payment_intent.metadata.subscription &&
          payment_intent.metadata.plan_id
        ) {
          stripe.subscriptions
            .update(payment_intent.metadata.subscription, {
              items: [
                {
                  plan: payment_intent.metadata.plan_id
                }
              ],
              proration_behavior: 'none'
            })
            .then(res => console.log('subscription updated'));
        }
        break;
      }
      default:
        // Unexpected event type
        callback(null, { statusCode: 400, body: 'invalid_webhook' });
    }
  }
}
