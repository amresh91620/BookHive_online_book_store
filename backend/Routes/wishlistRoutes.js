const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controller/wishlistController");

router.get("/", auth, getWishlist);
router.post("/add", auth, addToWishlist);
router.delete("/remove/:bookId", auth, removeFromWishlist);

module.exports = router;
