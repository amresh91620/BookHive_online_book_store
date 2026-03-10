const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  sendRegisterOtp,
  verifyRegisterOtp,
  register,
  login,
  sendForgotPasswordOtp,
  resetPassword,
  changePassword,
} = require("../controller/authController");
const {
  getProfile,
  updateProfile,
} = require("../controller/userController");

// Registration flow
router.post("/register/send-otp", sendRegisterOtp);
router.post("/register/verify-otp", verifyRegisterOtp);
router.post("/register", register);

// Login
router.post("/login", login);

// Password reset
router.post("/forgot-password/send-otp", sendForgotPasswordOtp);
router.post("/forgot-password/reset", resetPassword);

// Change password (protected)
router.post("/change-password", authMiddleware, changePassword);

// Profile (protected)
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
