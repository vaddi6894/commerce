const express = require("express");
const {
  createPaymentIntent,
  stripeWebhook,
  createCheckoutSession,
} = require("../controllers/paymentController");
const router = express.Router();

router.post("/create-intent", createPaymentIntent);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
router.post("/create-checkout-session", createCheckoutSession);

module.exports = router;
