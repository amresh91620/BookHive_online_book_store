const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getReviewsByBook,
  addReview,
  updateReview,
  deleteReview,
} = require("../controller/reviewController");

// Public route
router.get("/book/:bookId", getReviewsByBook);

// Protected routes
router.post("/", authMiddleware, addReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
