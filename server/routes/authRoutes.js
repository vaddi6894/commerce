const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getSettings,
  updateSettings,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:idx", protect, updateAddress);
router.delete("/addresses/:idx", protect, deleteAddress);
router.get("/settings", protect, getSettings);
router.put("/settings", protect, updateSettings);

module.exports = router;
