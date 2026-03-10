const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controller/orderController");

// All order routes require authentication
router.use(authMiddleware);

router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.post("/:id/cancel", cancelOrder);

module.exports = router;
