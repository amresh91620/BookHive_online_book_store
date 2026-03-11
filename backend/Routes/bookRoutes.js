const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  getCategories,
  getStatsBooks,
} = require("../controller/bookController");

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bookhive/books",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 1200, crop: "limit" }],
  },
});

const upload = multer({ storage });

// Public routes
router.get("/categories", getCategories);
router.get("/stats-books", getStatsBooks);
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, upload.single("coverImage"), addBook);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("coverImage"), updateBook);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBook);

module.exports = router;
