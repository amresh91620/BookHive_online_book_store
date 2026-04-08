const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getDashboardStats,
  getAllUsers,
  blockUser,
  unblockUser,
  toggleUserBlock,
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrderItemAdmin,
} = require("../controller/adminController");
const { getAllReviews, deleteUserReview } = require("../controller/reviewController");
const { getAllMessages, deleteMessage } = require("../controller/contactController");

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard
router.get("/dashboard", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.put("/users/:id/block", toggleUserBlock);
router.put("/users/:id/unblock", unblockUser);

// Order management
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderByIdAdmin);
router.put("/orders/:id/status", updateOrderStatus);
router.put("/orders/:id/payment", updatePaymentStatus);
router.post("/orders/:id/items/:itemId/cancel", cancelOrderItemAdmin);

// Review management
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteUserReview);

// Message management
router.get("/messages", getAllMessages);
router.delete("/messages/:id", deleteMessage);

module.exports = router;
