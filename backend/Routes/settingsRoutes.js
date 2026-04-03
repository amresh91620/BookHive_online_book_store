const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getSettings,
  getAdminSettings,
  updateSettings,
  resetSettings,
} = require("../controller/settingsController");

// Public route - Get settings for checkout
router.get("/", getSettings);

// Admin routes
router.get("/admin", authMiddleware, adminMiddleware, getAdminSettings);
router.put("/", authMiddleware, adminMiddleware, updateSettings);
router.post("/reset", authMiddleware, adminMiddleware, resetSettings);

module.exports = router;
