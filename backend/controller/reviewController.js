const Review = require("../model/Review");
const Book = require("../model/Book");

exports.addReview = async (req, res) => {
    try {
        const { bookId, rating, comment } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ msg: "Book not found" });
        }

        // ✅ Check if user already reviewed this book
        const existUserReview = await Review.findOne({
            book: bookId, 
            user: req.user._id 
        });

        if (existUserReview) {
            return res.status(400).json({ msg: "You already reviewed this book" });
        }

        const review = new Review({
            book: bookId,
            user: req.user._id,
            rating,
            comment
        });

        await review.save();
        
        // ✅ Populate user info immediately
        const populatedReview = await Review.findById(review._id).populate("user", "name email");
        res.status(201).json({ msg: "Review added successfully", review: populatedReview });
    } catch (error) {
        console.error("Add review error:", error);
        res.status(500).json({ msg: error.message });
    }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ msg: "Review not found" });

    // ✅ CRITICAL: Proper user ID comparison
    const reviewUserId = review.user.toString();
    const currentUserId = req.user._id.toString();

    if (reviewUserId !== currentUserId) {
      return res.status(403).json({ msg: "Not authorized to edit this review" });
    }

    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    
    review.isEdited = true;
    review.updatedAt = Date.now();

    await review.save();
    
    // ✅ Fetch updated review with populated user info
    const updatedReview = await Review.findById(review._id).populate("user", "name email");
    
    res.json({ msg: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ msg: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ msg: "Review not found" });

    // ✅ CRITICAL: Proper user ID comparison
    const reviewUserId = review.user.toString();
    const currentUserId = req.user._id.toString();


    if (reviewUserId !== currentUserId) {
      return res.status(403).json({ msg: "Not authorized to delete this review" });
    }

    // ✅ Use deleteOne() instead of deprecated remove()
    await Review.deleteOne({ _id: req.params.id }); 
    
    res.json({ msg: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ msg: error.message });
  }
};

exports.getReviewsByBook = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
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
    console.error("Get all reviews error:", error);
    res.status(500).json({ msg: error.message });
  }
};

exports.deleteUserReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }
    res.json({ msg: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ msg: error.message });
  }
};