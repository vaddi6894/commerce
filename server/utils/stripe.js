const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
// console.log(process.env.STRIPE_SECRET_KEY);