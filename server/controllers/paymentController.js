const stripe = require("../utils/stripe");
const Order = require("../models/Order");

// Create Payment Intent
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, shippingAddress } = req.body;
    // Validate country code (must be 2 uppercase letters)
    const country = (shippingAddress?.country || "").toUpperCase();
    if (!/^[A-Z]{2}$/.test(country)) {
      return res.status(400).json({
        message: "Invalid country code. Please select a valid country.",
      });
    }
    // Use INR for India, USD otherwise
    const currency = country === "IN" ? "inr" : "usd";
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // in cents
      currency,
      description: `Shoppie order payment${
        country === "IN" ? " (India export)" : ""
      }`,
      confirm: false,
      capture_method: "automatic",
      metadata: { integration_check: "accept_a_payment" },
      shipping: {
        name: shippingAddress?.name || "Customer",
        address: {
          line1: shippingAddress?.address || "",
          city: shippingAddress?.city || "",
          postal_code: shippingAddress?.postalCode || "",
          country,
        },
      },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
};

// Stripe Webhook
exports.stripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // Handle event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      // Extract metadata
      const cart = JSON.parse(session.metadata.cart || "[]");
      const shippingAddress = JSON.parse(
        session.metadata.shippingAddress || "{}"
      );
      const userEmail = session.customer_email;
      // Find user by email
      const User = require("../models/User");
      const user = await User.findOne({ email: userEmail });
      if (user) {
        // Prepare order items
        const orderItems = cart.map((item) => ({
          product: item.product,
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image,
        }));
        // Create order
        await Order.create({
          user: user._id,
          orderItems,
          shippingAddress,
          paymentInfo: { stripeSessionId: session.id },
        });
      }
    } catch (err) {
      // Log error but don't fail webhook
      console.error("Order creation error in webhook:", err);
    }
  }
  res.json({ received: true });
};

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { cart, shippingAddress, userEmail, line_items } = req.body;
    // Use line_items from frontend if provided, else build from cart
    const items =
      line_items && Array.isArray(line_items) && line_items.length > 0
        ? line_items.map((item) => ({
            ...item,
            quantity: Number(item.quantity),
          }))
        : cart.map((item) => ({
            price_data: {
              currency: "inr",
              product_data: {
                name: item.name,
              },
              unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: Number(item.qty),
          }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      customer_email: userEmail,
      success_url: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/checkout`,
      shipping_address_collection: { allowed_countries: ["IN"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "inr" },
            display_name: "Free Shipping",
          },
        },
      ],
      metadata: {
        cart: JSON.stringify(cart),
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};
