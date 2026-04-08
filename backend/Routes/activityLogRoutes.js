const express = require("express");
const router = express.Router();
const {
  getActivityLogs,
  getActivityStats,
  cleanupOldLogs,
} = require("../controller/activityLogController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

// Get activity logs
router.get("/", getActivityLogs);

// Get activity stats
router.get("/stats", getActivityStats);

// Cleanup old logs
router.delete("/cleanup", cleanupOldLogs);

module.exports = router;
