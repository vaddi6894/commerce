import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51RthwSSZA0JyXr40WlF4OuhI3OwL1qVqBsTkV4lrMkBtY9sZCYYjgBTHplrbWjaxclvLnnwV7zsSrCXaA0nFWFmp00tP613QWZ"
);

const StripeProvider = ({ children }) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);

export default StripeProvider;
