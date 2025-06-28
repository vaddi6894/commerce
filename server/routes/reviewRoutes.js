const express = require("express");
const {
  createReview,
  deleteReview,
  getReviewsForProduct,
} = require("../controllers/reviewController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, createReview);
router.delete("/:id", protect, deleteReview);
router.get("/product/:productId", getReviewsForProduct);

module.exports = router;
