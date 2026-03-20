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
  lookupBookByISBN,
  bulkUploadBooks,
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

// Configure multer for CSV upload (memory storage)
const csvUpload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Public routes
router.get("/categories", getCategories);
router.get("/stats-books", getStatsBooks);
router.get("/", getAllBooks);

// Admin routes (place specific routes before parameterized routes)
router.get("/lookup/:isbn", authMiddleware, adminMiddleware, lookupBookByISBN);
router.post("/bulk-upload", authMiddleware, adminMiddleware, csvUpload.single("file"), bulkUploadBooks);
router.post("/", authMiddleware, adminMiddleware, upload.single("coverImage"), addBook);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("coverImage"), updateBook);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBook);

// Public route with :id parameter (must be last)
router.get("/:id", getBookById);

module.exports = router;
