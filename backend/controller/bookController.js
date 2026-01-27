const Book = require("../model/Book");
const cloudinary = require("../config/cloudinary");

/**
 * ✅ Get All Books
 */
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().select("-__v");

    if (!books || books.length === 0) {
      return res.status(404).json({ msg: "No books found" });
    }

    res.status(200).json({
      totalBooks: books.length,
      books,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ Add New Book (with Cloudinary image upload)
 */
exports.addBook = async (req, res) => {
  try {
    const { title, author, description, categories, price, publishedDate, pages } = req.body;

    // Validate if file exists
    if (!req.file) {
      return res.status(400).json({ msg: "Cover image is required" });
    }

    // 🔒 Validation
    if (!title || !author || !description || !categories || !price || !publishedDate || !pages) {
      return res.status(400).json({ msg: "All required fields must be filled" });
    }

    if (title.length < 2) return res.status(400).json({ msg: "Title must be at least 2 characters" });
    if (price < 0) return res.status(400).json({ msg: "Price cannot be negative" });
    if (pages < 1) return res.status(400).json({ msg: "Pages must be greater than 0" });

    // Multer + Cloudinary: file uploaded
    const coverImageUrl = req.file.path; // Cloudinary URL

    const book = await Book.create({
      title,
      author,
      description,
      categories,
      price,
      publishedDate,
      pages,
      coverImage: coverImageUrl,
    });

    res.status(201).json({
      msg: "Book added successfully",
      book,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ Update Book (Cloudinary support)
 */
exports.updateBook = async (req, res) => {
  try {

    // Handle new cover image if uploaded
    if (req.file) {
      req.body.coverImage = req.file.path; // Cloudinary URL
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    res.status(200).json({
      msg: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ Delete Book
 */
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    res.status(200).json({ msg: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
