import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/stripe-js';

export default function StripePaymentForm(handlePayment) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { token, error } = await stripe.createToken(elements.getElement(CardElement));

    if (error) {
      console.error(error);
    } else {
      // Handle successful token creation, e.g., send it to your server
      console.log(token);
      handlePayment(token);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay</button>
    </form>
  );
}