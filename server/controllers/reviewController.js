const Review = require("../models/Review");
const Product = require("../models/Product");

// Create Review
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const existing = await Review.findOne({
      user: req.user._id,
      product: productId,
    });
    if (existing) return res.status(400).json({ message: "Already reviewed" });
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });
    // Update product average rating
    const reviews = await Review.find({ product: productId });
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { ratings: avg });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

// Delete Review
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await review.remove();
    // Update product average rating
    const reviews = await Review.find({ product: review.product });
    const avg = reviews.length
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;
    await Product.findByIdAndUpdate(review.product, { ratings: avg });
    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};

// Get all reviews for a product
exports.getReviewsForProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "name"
    );
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
