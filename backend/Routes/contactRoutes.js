const express = require("express");
const router = express.Router();
const contactController = require("../controller/contactController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public route - Send contact message
router.post("/", contactController.sendMessage);

// Admin routes - Get and delete messages
router.get("/", authMiddleware, adminMiddleware, contactController.getAllMessages);
router.delete("/:id", authMiddleware, adminMiddleware, contactController.deleteMessage);

module.exports = router;
