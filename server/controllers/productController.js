const Product = require("../models/Product");

// Create Product (Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// Get All Products (with search, filter, pagination)
exports.getProducts = async (req, res, next) => {
  try {
    const { keyword = "", category, page = 1, limit = 10, ids } = req.query;
    let query = {
      name: { $regex: keyword, $options: "i" },
      ...(category && { category }),
    };
    if (ids) {
      // If ids are provided, filter by those product IDs
      const idArr = ids.split(",").map((id) => id.trim());
      query = { _id: { $in: idArr } };
    }
    const products = await Product.find(query)
      .skip(ids ? 0 : (page - 1) * limit)
      .limit(ids ? 0 : Number(limit));
    const count = await Product.countDocuments(query);
    res.json({ products, count });
  } catch (err) {
    next(err);
  }
};

// Get Single Product
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Update Product (Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Delete Product (Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
