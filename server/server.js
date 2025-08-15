require("dotenv").config();
const express = require("express");

const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Product = require("./models/Product");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load env vars
// dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Stripe webhook needs raw body
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);

// Error Handler
app.use(errorHandler);

// Seed products from real_25_products.json if collection is empty
(async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const filePath = path.resolve(__dirname, "./real_25_products.json");
      const json = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(json);
      if (Array.isArray(data) && data.length > 0) {
        await Product.insertMany(data);
        console.log(
          `Seeded ${data.length} products from real_25_products.json`
        );
      }
    }
  } catch (e) {
    console.error("Product seeding failed:", e.message);
  }
})();

// Serve React build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
