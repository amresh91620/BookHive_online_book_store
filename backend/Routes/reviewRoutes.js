const express = require("express");
const router = express.Router()
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const { addReview, updateReview, deleteReview, getReviewsByBook, getAllReviews,deleteUserReview } = require("../controller/reviewController");

//users
router.post('/', auth, addReview);
router.put("/:id", auth, updateReview);
router.delete("/:id", auth, deleteReview);
//pubalic
router.get("/book/:bookId", getReviewsByBook);
//admin
router.get("/", auth, isAdmin, getAllReviews);
router.delete("/delete/:id", auth, isAdmin, deleteUserReview);
module.exports = router;