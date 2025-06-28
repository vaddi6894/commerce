const Order = require("../models/Order");
const Product = require("../models/Product");

// Place Order
exports.placeOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentInfo } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }
    // Update stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.qty;
        await product.save();
      }
    }
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentInfo,
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// Get User Orders
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Update Order Status (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.orderStatus = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// Get Order by Stripe Session ID
exports.getOrderBySessionId = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const order = await Order.findOne({
      "paymentInfo.stripeSessionId": sessionId,
    }).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// Get Order by Order ID
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};
