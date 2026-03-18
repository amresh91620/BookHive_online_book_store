const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getAllBlogs,
  getBlogById,
  getBlogCategories,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blogController");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bookhive/blogs",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 630, crop: "limit" }],
  },
});

const upload = multer({ storage });

// Public
router.get("/categories", getBlogCategories);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// Admin
router.post("/", authMiddleware, adminMiddleware, upload.single("coverImage"), createBlog);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("coverImage"), updateBlog);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBlog);

module.exports = router;
