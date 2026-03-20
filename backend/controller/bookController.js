const Book = require("../models/Book");
const cloudinary = require("../config/cloudinary");
const { fetchBookByISBN } = require("../services/bookApiService");
const { parseCSV, validateBookData } = require("../services/csvParser");
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI for bulk upload
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
let geminiQuotaExceeded = false; // Track if quota is exceeded

/**
 * ✅ Get Unique Categories
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct("categories");
    res.status(200).json({ categories: categories.filter(Boolean) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

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
    const statusFilter = (req.query.status || "").trim();

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

    if (statusFilter) {
      if (statusFilter === 'featured') filters.push({ featured: true });
      if (statusFilter === 'bestseller') filters.push({ bestseller: true });
      if (statusFilter === 'newArrival') filters.push({ newArrival: true });
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
      const query = Book.find(filter).select("-__v").sort({ createdAt: -1 });
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
 * ✅ Get Single Book by ID
 */
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).select("-__v");
    
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    res.status(200).json({ book });
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
      aboutBook,
      aboutAuthor,
      categories, 
      price, 
      originalPrice,
      publishedDate, 
      pages,
      isbn,
      publisher,
      language,
      format,
      stock,
      featured,
      bestseller,
      newArrival,
      ageGroup,
      coverImageUrl
    } = req.body;

    // Validate required fields
    if (!title || !author || !aboutBook || !categories || !price || !pages) {
      return res.status(400).json({ msg: "All required fields must be filled" });
    }

    // Validate image - either file upload or URL from API
    if (!req.file && !coverImageUrl) {
      return res.status(400).json({ msg: "Cover image is required" });
    }

    // Validation
    if (title.length < 2) return res.status(400).json({ msg: "Title must be at least 2 characters" });
    if (price < 0) return res.status(400).json({ msg: "Price cannot be negative" });
    if (pages < 1) return res.status(400).json({ msg: "Pages must be greater than 0" });

    const coverImage = req.file ? req.file.path : coverImageUrl;

    const book = await Book.create({
      title,
      author,
      aboutBook,
      aboutAuthor: aboutAuthor || undefined,
      description: aboutBook, // Keep for backward compatibility
      categories,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      publishedDate: publishedDate || undefined,
      pages: Number(pages),
      isbn: isbn || undefined,
      publisher: publisher || undefined,
      language: language || 'English',
      format: format || 'Paperback',
      stock: stock ? Number(stock) : 0,
      coverImage: coverImage,
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
    console.error('❌ Error adding book:', error);
    
    // Handle duplicate ISBN error
    if (error.code === 11000 && error.keyPattern?.isbn) {
      return res.status(400).json({ 
        error: "A book with this ISBN already exists",
        field: "isbn"
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: messages.join(', '),
        validationErrors: error.errors
      });
    }
    
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

/**
 * ✅ Get Optimized Book Stats (Featured, bestseller, newArrival)
 * Added for frontend optimization to avoid filtering large collections in the browser
 */
exports.getStatsBooks = async (req, res) => {
  try {
    const featured = await Book.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("-description -__v");
    const bestsellers = await Book.find({ bestseller: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("-description -__v");
    const newArrivals = await Book.find({ newArrival: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("-description -__v");

    res.status(200).json({
      featured,
      bestsellers,
      newArrivals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ Lookup Book by ISBN from external APIs
 */
exports.lookupBookByISBN = async (req, res) => {
  try {
    const { isbn } = req.params;

    if (!isbn) {
      return res.status(400).json({ msg: "ISBN is required" });
    }

    const bookData = await fetchBookByISBN(isbn);

    if (!bookData) {
      return res.status(404).json({ 
        msg: "Book not found in external databases",
        found: false 
      });
    }

    res.status(200).json({
      msg: "Book data found",
      found: true,
      data: bookData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ Bulk Upload Books from CSV
 */
exports.bulkUploadBooks = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "CSV file is required" });
    }

    // Read CSV content from buffer
    const csvContent = req.file.buffer.toString('utf-8');
    
    // Parse CSV
    const booksData = parseCSV(csvContent);

    if (booksData.length === 0) {
      return res.status(400).json({ msg: "No valid book data found in CSV" });
    }

    const results = {
      success: [],
      failed: []
    };

    // Process each book
    for (let i = 0; i < booksData.length; i++) {
      const { book, errors } = validateBookData(booksData[i]);

      if (errors.length > 0) {
        results.failed.push({
          row: i + 2, // +2 because of header row and 0-index
          data: booksData[i],
          errors: errors
        });
        continue;
      }

      try {
        // Check if ISBN already exists
        if (book.isbn) {
          const existingBook = await Book.findOne({ isbn: book.isbn });
          if (existingBook) {
            results.failed.push({
              row: i + 2,
              data: booksData[i],
              errors: [`Book with ISBN ${book.isbn} already exists`]
            });
            continue;
          }
        }

        // Generate AI content if aboutBook or aboutAuthor is short/missing
        // This allows CSV to have short descriptions that Gemini will expand
        let geminiAttempts = 0;
        const maxGeminiAttempts = 2;
        
        while (geminiAttempts < maxGeminiAttempts) {
          try {
            // Generate About Book
            if (book.aboutBook && book.aboutBook.length < 100) {
              console.log(`🤖 [Attempt ${geminiAttempts + 1}] Expanding short About Book for: ${book.title}`);
              if (genAI) {
                const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
                const prompt = `Write a detailed 200-word description about the book "${book.title}" by ${book.author}. Include the plot summary, main themes, character development, and why this book is significant in literature. Make it engaging and informative for readers. Expand on this hint: ${book.aboutBook}`;
                const result = await model.generateContent(prompt);
                const fullText = result.response.text();
                book.aboutBook = fullText.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '').replace(/`/g, '').trim();
                console.log(`✅ Generated ${book.aboutBook.split(' ').length} words for About Book`);
              }
            } else if (!book.aboutBook || book.aboutBook.length < 20) {
              console.log(`🤖 [Attempt ${geminiAttempts + 1}] Generating About Book for: ${book.title}`);
              if (genAI) {
                const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
                const prompt = `Write a comprehensive 200-word description about the book "${book.title}" by ${book.author}. Include the plot summary, main themes, character development, writing style, and why this book is significant in literature. Make it engaging and informative for readers.`;
                const result = await model.generateContent(prompt);
                const fullText = result.response.text();
                book.aboutBook = fullText.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '').replace(/`/g, '').trim();
                console.log(`✅ Generated ${book.aboutBook.split(' ').length} words for About Book`);
              } else {
                book.aboutBook = `${book.title} by ${book.author} is a notable work in literature.`;
              }
            }

            // Generate About Author
            if (!book.aboutAuthor || book.aboutAuthor.length < 50) {
              console.log(`🤖 [Attempt ${geminiAttempts + 1}] Generating About Author for: ${book.author}`);
              if (genAI) {
                const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
                const prompt = `Write a detailed 100-word biography about the author ${book.author}. Include their birth/death dates if known, educational background, major literary works, writing style, awards and recognition, and their lasting impact on literature. Make it informative and engaging.`;
                const result = await model.generateContent(prompt);
                const fullText = result.response.text();
                book.aboutAuthor = fullText.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '').replace(/`/g, '').trim();
                console.log(`✅ Generated ${book.aboutAuthor.split(' ').length} words for About Author`);
              } else {
                book.aboutAuthor = `${book.author} is a renowned author.`;
              }
            }
            
            // Success - break out of retry loop
            break;
            
          } catch (geminiError) {
            geminiAttempts++;
            console.error(`❌ Gemini generation error (attempt ${geminiAttempts}/${maxGeminiAttempts}):`, geminiError.message);
            
            if (geminiAttempts >= maxGeminiAttempts) {
              // Max attempts reached - use fallback
              console.log(`⚠️ Using fallback descriptions for: ${book.title}`);
              if (!book.aboutBook || book.aboutBook.length < 100) {
                book.aboutBook = `${book.title} by ${book.author} is a notable work in literature. This book has captivated readers with its compelling narrative and profound themes. It explores important aspects of human experience and has earned its place in literary history.`;
              }
              if (!book.aboutAuthor || book.aboutAuthor.length < 50) {
                book.aboutAuthor = `${book.author} is a renowned author known for their significant contributions to literature. Their works have influenced countless readers and writers.`;
              }
            } else {
              // Wait before retry
              console.log(`⏳ Waiting 2 seconds before retry...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }

        const createdBook = await Book.create(book);
        results.success.push({
          row: i + 2,
          bookId: createdBook._id,
          title: createdBook.title
        });
      } catch (error) {
        results.failed.push({
          row: i + 2,
          data: booksData[i],
          errors: [error.message]
        });
      }
    }

    res.status(200).json({
      msg: "Bulk upload completed",
      total: booksData.length,
      successCount: results.success.length,
      failedCount: results.failed.length,
      results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
