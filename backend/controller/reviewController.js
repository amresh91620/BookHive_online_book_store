const Review = require("../model/Review");
const Book = require("../model/Book");

exports.addReview = async (req, res) => {
    try {
        const { bookId, rating, comment } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ msg: "Book not found" });
        }

        //  Check if user already reviewed
        const existUserReview = await Review.findOne({
            book: bookId,
            user: req.user.id //  from JWT, NOT body
        });
        if (existUserReview) {
            return res.status(400).json({ msg: "You already reviewed this book" });
        }

        //Create review
        const review = new Review({
            book: bookId,
            user: req.user.id, //  from JWT
            rating,
            comment
        });

        await review.save();

        res.status(201).json({ msg: "Review added successfully", review });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ msg: "Review not found" });

    // Only owner can update
    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized" });

    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    review.isEdited = true;
    review.updatedAt = Date.now();

    await review.save();
    res.json({ msg: "Review updated successfully", review });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ msg: "Review not found" });

    // Only owner can delete
    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized" });

    await review.remove();
    res.json({ msg: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.getReviewsByBook = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate("user", "name email")
      .sort({ createdAt: -1 }); // latest first

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("book", "title author")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};