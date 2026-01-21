const Book = require("../model/Book")
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().select("-__v");

        if (books.length === 0) {
            return res.status(404).json({ msg: "No Books found." });
        }

        res.status(200).json({
            totalBooks: books.length,
            books,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addBook = async (req, res) => {
    try {
        const { title, author, description, genre, price, publishedYear, coverImage } = req.body;
        if (!title || !author || !genre || !price || !publishedYear || !coverImage) {
            return res.status(400).json({ msg: "All required fields must be filled" });
        }
        if (title.length < 2) {
            return res.status(400).json({ msg: "Title must be at least 2 characters" });
        }
        if (price < 0) {
            return res.status(400).json({ msg: "Price cannot be negative" });
        }
        const book = await Book.create({
            title,
            author,
            description,
            genre,
            price,
            publishedYear,
            coverImage,
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


exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });

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
