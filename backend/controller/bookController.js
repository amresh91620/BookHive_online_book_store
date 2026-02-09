const Book = require("../models/Book");
const cloudinary = require("../config/cloudinary");

/**
 * ✅ Get All Books
 */
exports.getAllBooks = async (req, res) => {
  try {
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
    const limitRaw = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(limitRaw) ? Math.max(limitRaw, 0) : 0;
    const cursorMode = Object.prototype.hasOwnProperty.call(req.query, "cursor");
    const cursor = req.query.cursor || null;
    const q = (req.query.q || "").trim();
    const category = (req.query.category || "").trim();

    const escapeRegex = (value) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const filters = [];
    if (q) {
      filters.push({
        $or: [
          { title: { $regex: q, $options: "i" } },
          { author: { $regex: q, $options: "i" } },
        ],
      });
    }
    if (category) {
      filters.push({
        categories: { $regex: escapeRegex(category), $options: "i" },
      });
    }

    const filter = filters.length > 0 ? { $and: filters } : {};

    const totalBooks = await Book.countDocuments(filter);

    const mongoose = require("mongoose");
    let books = [];
    let nextCursor = null;
    let hasMore = false;

    if (cursorMode) {
      let cursorFilter = filter;
      if (mongoose.Types.ObjectId.isValid(cursor)) {
        cursorFilter = { ...filter, _id: { $lt: cursor } };
      }
      const page = await Book.find(cursorFilter)
        .select("-__v")
        .sort({ _id: -1 })
        .limit((limit || 10) + 1);
      hasMore = page.length > (limit || 10);
      books = hasMore ? page.slice(0, limit || 10) : page;
      nextCursor = books.length > 0 ? books[books.length - 1]._id : null;
    } else {
      const query = Book.find(filter).select("-__v");
      if (offset) query.skip(offset);
      if (limit) query.limit(limit);
      books = await query;
    }

    res.status(200).json({
      totalBooks,
      offset,
      limit: limit || totalBooks,
      books: books || [],
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ Add New Book (with ALL fields)
 */
exports.addBook = async (req, res) => {
  try {
    const { 
      title, 
      author, 
      description, 
      categories, 
      price, 
      originalPrice,
      publishedDate, 
      pages,
      isbn,
      publisher,
      language,
      format,
      edition,
      genre,
      stock,
      featured,
      bestseller,
      newArrival,
      ageGroup
    } = req.body;

    // Validate required fields
    if (!title || !author || !description || !categories || !price || !publishedDate || !pages) {
      return res.status(400).json({ msg: "All required fields must be filled" });
    }

    // Validate image
    if (!req.file) {
      return res.status(400).json({ msg: "Cover image is required" });
    }

    // Validation
    if (title.length < 2) return res.status(400).json({ msg: "Title must be at least 2 characters" });
    if (price < 0) return res.status(400).json({ msg: "Price cannot be negative" });
    if (pages < 1) return res.status(400).json({ msg: "Pages must be greater than 0" });

    const coverImageUrl = req.file.path;

    const book = await Book.create({
      title,
      author,
      description,
      categories,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      publishedDate,
      pages: Number(pages),
      isbn: isbn || undefined,
      publisher: publisher || undefined,
      language: language || 'English',
      format: format || 'Paperback',
      edition: edition || undefined,
      genre: genre || undefined,
      stock: stock ? Number(stock) : 0,
      coverImage: coverImageUrl,
      featured: featured === 'true' || featured === true,
      bestseller: bestseller === 'true' || bestseller === true,
      newArrival: newArrival === 'true' || newArrival === true,
      ageGroup: ageGroup || undefined,
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
 * ✅ Update Book
 */
exports.updateBook = async (req, res) => {
  try {
    // Handle new cover image if uploaded
    if (req.file) {
      req.body.coverImage = req.file.path;
    }

    // Convert string booleans to actual booleans
    if (req.body.featured !== undefined) {
      req.body.featured = req.body.featured === 'true' || req.body.featured === true;
    }
    if (req.body.bestseller !== undefined) {
      req.body.bestseller = req.body.bestseller === 'true' || req.body.bestseller === true;
    }
    if (req.body.newArrival !== undefined) {
      req.body.newArrival = req.body.newArrival === 'true' || req.body.newArrival === true;
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