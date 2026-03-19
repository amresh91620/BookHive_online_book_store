const mongoose = require("mongoose");
const Review = require("../models/Review");
const Book = require("../models/Book");

// Helper function to update book rating
const updateBookRating = async (bookId) => {
    try {
        const stats = await Review.aggregate([
            { $match: { book: new mongoose.Types.ObjectId(bookId) } },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        const { avgRating = 0, totalReviews = 0 } = stats[0] || {};
        
        await Book.findByIdAndUpdate(bookId, {
            rating: avgRating,
            totalReviews: totalReviews
        });
    } catch (error) {
        console.error("Update book rating error:", error);
    }
};

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
        
        // ✅ Update book rating
        await updateBookRating(bookId);
        
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
    
    // ✅ Update book rating
    await updateBookRating(review.book);
    
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

    const bookId = review.book;

    // ✅ Use deleteOne() instead of deprecated remove()
    await Review.deleteOne({ _id: req.params.id }); 
    
    // ✅ Update book rating
    await updateBookRating(bookId);
    
    res.json({ msg: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ msg: error.message });
  }
};

exports.getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.json({
        reviews: [],
        nextCursor: null,
        hasMore: false,
        totalRatings: 0,
        avgRating: "0.0",
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    }
    const limitRaw = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(limitRaw) ? Math.max(limitRaw, 1) : 5;
    const cursor = req.query.cursor || null;

    let filter = { book: bookId };
    if (cursor) {
      const cursorReview = await Review.findById(cursor).select("createdAt");
      if (cursorReview) {
        filter = {
          ...filter,
          $or: [
            { createdAt: { $lt: cursorReview.createdAt } },
            {
              createdAt: cursorReview.createdAt,
              _id: { $lt: cursorReview._id },
            },
          ],
        };
      }
    }

    const page = await Review.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1);

    const hasMore = page.length > limit;
    const reviews = hasMore ? page.slice(0, limit) : page;
    const nextCursor = reviews.length > 0 ? reviews[reviews.length - 1]._id : null;

    const statsAgg = await Review.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(bookId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avg: { $avg: "$rating" },
          r1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          r2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          r3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          r4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          r5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
        },
      },
    ]);

    const stats = statsAgg[0] || { total: 0, avg: 0, r1: 0, r2: 0, r3: 0, r4: 0, r5: 0 };

    res.json({
      reviews,
      nextCursor,
      hasMore,
      totalRatings: stats.total,
      avgRating: stats.avg ? stats.avg.toFixed(1) : "0.0",
      ratingDistribution: {
        1: stats.r1 || 0,
        2: stats.r2 || 0,
        3: stats.r3 || 0,
        4: stats.r4 || 0,
        5: stats.r5 || 0,
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ msg: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
    const limitRaw = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(limitRaw) ? Math.max(limitRaw, 1) : 20;
    const search = (req.query.q || "").trim();
    const rating = req.query.rating ? parseInt(req.query.rating) : null;

    const filter = {};
    
    // Rating filter
    if (rating && rating >= 1 && rating <= 5) {
      filter.rating = rating;
    }

    // Search filter
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { comment: searchRegex }
      ];
    }

    const total = await Review.countDocuments(filter);
    
    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .populate("book", "title author")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    
    res.json({
      reviews,
      total,
      offset,
      limit
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({ msg: error.message });
  }
};

exports.deleteUserReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }
    
    const bookId = review.book;
    
    await Review.findByIdAndDelete(req.params.id);
    
    // ✅ Update book rating
    await updateBookRating(bookId);
    
    res.json({ msg: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ msg: error.message });
  }
};
