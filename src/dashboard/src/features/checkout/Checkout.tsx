import React from 'react';

import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_8rKdDaAeI4GIQC2lOf8jrHcm00qLwSKOcE');

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      //@ts-ignore
      card: cardElement
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      const data = {
        address: {
          line1: 'via san leucio n.4',
          country: 'IT',
          state: 'BN'
        },
        name: 'Pietro Falco',
        tax_id: 'IT12345678901',
        codice_univoco: '6666',
        payment_method: paymentMethod.id,
        plan: 'pro'
      };
      fetch('/.netlify/functions/subscriptions', {
        method: 'POST',
        headers: {
          authorization:
            'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyZTZiMWM5MjFmYTg2NzcwZjNkNTBjMTJjMTVkNmVhY2E4ZjBkMzUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcGxpY28tZGV2IiwiYXVkIjoicGxpY28tZGV2IiwiYXV0aF90aW1lIjoxNTg0NzIxODI4LCJ1c2VyX2lkIjoiMSIsInN1YiI6IjEiLCJpYXQiOjE1ODQ3MjE4MjgsImV4cCI6MTU4NDcyNTQyOCwiZW1haWwiOiJmbGMucGlldHJvQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJmbGMucGlldHJvQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.h_uCdZd6RK3FtN2y4wz4kT_5H7KcjkYHM7YNMlvoDbwGnvPm4vOl_r9oxExNSlVX9dtl6fg97KdEjoeKCZcLfuC-wt74PvvyJrw6h-48dLY0PQT3RfVZotPQ42KZUsBTS28ee69diK93NBMncZHqCTSCOWq3Oebwc0e636Mqf-wOzMIpt3AINgCm7IM9Ya_QofriYkcJBAx09yga3HC1sp21ypzjT1bxxQnJwnpQhMfuldP6Xc5Lu-6sUMISG9deG1hBNCnLluE15XNxiiJ90JPXNy40AvKeBYX_H6crALb2-NQS6sJVo_ey_WzfTHUgXeWRD_8O2_Lsc9Ooo5bInQ'
        },
        body: JSON.stringify(data)
      }).then(async res => {
        const subscription = await res.json();
        const { latest_invoice } = subscription;
        const { payment_intent } = latest_invoice;

        if (payment_intent) {
          const { client_secret, status } = payment_intent;

          if (status === 'requires_action') {
            stripe.confirmCardPayment(client_secret).then(function(result) {
              if (result.error) {
                // Display error message in your UI.
                // The card was declined (i.e. insufficient funds, card has expired, etc)
                console.log(result.error.message);
              } else {
                // Show a success message to your customer
                console.log('okkk');
              }
            });
          } else {
            // No additional information was needed
            // Show a success message to your customer
            console.log('success');
          }
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default Checkout;
