const express = require("express");
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderBySessionId,
  getOrderById,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my", protect, getUserOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.get("/by-session/:sessionId", getOrderBySessionId);
router.get("/:id", protect, getOrderById);

module.exports = router;
