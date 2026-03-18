const BlogComment = require("../models/BlogComment");
const Blog = require("../models/Blog");

// Get all comments for a blog
exports.getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await BlogComment.find({ blog: blogId })
      .populate("user", "_id name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BlogComment.countDocuments({ blog: blogId });

    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a comment
exports.createComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = await BlogComment.create({
      blog: blogId,
      user: req.user._id,
      content,
    });

    const populatedComment = await BlogComment.findById(comment._id).populate(
      "user",
      "name email"
    );

    res.status(201).json({ comment: populatedComment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await BlogComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    const populatedComment = await BlogComment.findById(comment._id).populate(
      "user",
      "name email"
    );

    res.json({ comment: populatedComment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await BlogComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await BlogComment.findByIdAndDelete(commentId);

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a comment
exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await BlogComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove from dislikes if present
    comment.dislikes = comment.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );

    // Toggle like
    const likeIndex = comment.likes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      userLiked: likeIndex === -1,
      userDisliked: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dislike a comment
exports.dislikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await BlogComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove from likes if present
    comment.likes = comment.likes.filter(
      (id) => id.toString() !== userId.toString()
    );

    // Toggle dislike
    const dislikeIndex = comment.dislikes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (dislikeIndex > -1) {
      comment.dislikes.splice(dislikeIndex, 1);
    } else {
      comment.dislikes.push(userId);
    }

    await comment.save();

    res.json({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
      userLiked: false,
      userDisliked: dislikeIndex === -1,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all comments with blog info
exports.getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 20, blogId } = req.query;

    const filter = blogId ? { blog: blogId } : {};

    const comments = await BlogComment.find(filter)
      .populate("user", "name email")
      .populate("blog", "title")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BlogComment.countDocuments(filter);

    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete any comment
exports.adminDeleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await BlogComment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
