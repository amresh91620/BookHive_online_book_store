const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const { getAllBooks, addBook, updateBook, deleteBook } = require("../controller/bookController");

// Multer Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "book_covers",  
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const parser = multer({ storage });

router.get('/', getAllBooks);
router.post('/add-book', auth, isAdmin, parser.single("coverImage"), addBook);
router.put('/update-book/:id', auth, isAdmin, parser.single("coverImage"), updateBook);
router.delete('/delete-book/:id', auth, isAdmin, deleteBook);

module.exports = router;
