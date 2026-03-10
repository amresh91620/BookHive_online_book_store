const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controller/wishlistController");

// All wishlist routes require authentication
router.use(authMiddleware);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:bookId", removeFromWishlist);

module.exports = router;
