const mongoose = require("mongoose");
const User = require("../models/User");
const Book = require("../models/Book");

const selectFields =
  "title author price originalPrice coverImage categories format language discount stock rating";

const populateWishlist = (query) =>
  query.populate({ path: "wishlist", select: selectFields });

exports.getWishlist = async (req, res) => {
  try {
    const user = await populateWishlist(
      User.findById(req.user.id).select("wishlist")
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ msg: "Failed to load wishlist" });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body || {};

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ msg: "Valid bookId is required" });
    }

    const exists = await Book.findById(bookId).select("_id");
    if (!exists) {
      return res.status(404).json({ msg: "Book not found" });
    }

    const user = await populateWishlist(
      User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { wishlist: bookId } },
        { new: true }
      )
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ msg: "Failed to update wishlist" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params || {};

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ msg: "Valid bookId is required" });
    }

    const user = await populateWishlist(
      User.findByIdAndUpdate(
        req.user.id,
        { $pull: { wishlist: bookId } },
        { new: true }
      )
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ msg: "Failed to update wishlist" });
  }
};
