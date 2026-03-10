const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
} = require("../controller/cartController");

// All cart routes require authentication
router.use(authMiddleware);

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:itemId", removeFromCart);
router.put("/:itemId", updateQuantity);

module.exports = router;
