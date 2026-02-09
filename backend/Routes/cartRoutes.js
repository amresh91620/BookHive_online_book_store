// routes/cartRoutes.js
const express = require("express");
const {  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,} = require('../controller/cartController');
const auth = require('../middleware/authMiddleware');

const router = express.Router()

router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.delete("/:itemId", auth, removeFromCart);
router.put("/:itemId", auth, updateQuantity);

module.exports = router;
