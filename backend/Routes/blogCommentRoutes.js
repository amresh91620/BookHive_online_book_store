const express = require("express");
const router = express.Router();
const {
  getBlogComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  getAllComments,
  adminDeleteComment,
} = require("../controller/blogCommentController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public routes
router.get("/blog/:blogId", getBlogComments);

// Protected routes
router.post("/blog/:blogId", authMiddleware, createComment);
router.put("/:commentId", authMiddleware, updateComment);
router.delete("/:commentId", authMiddleware, deleteComment);
router.post("/:commentId/like", authMiddleware, likeComment);
router.post("/:commentId/dislike", authMiddleware, dislikeComment);

// Admin routes
router.get("/admin/all", authMiddleware, adminMiddleware, getAllComments);
router.delete("/admin/:commentId", authMiddleware, adminMiddleware, adminDeleteComment);

module.exports = router;
