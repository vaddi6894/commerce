const express = require("express");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// Get all users (admin only)
router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Update user role (admin only)
router.put("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.role = req.body.role;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
