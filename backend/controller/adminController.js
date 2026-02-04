const User = require("../models/User");
const Book = require("../models/Book");
const Review = require("../models/Review");


exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalBooks = await Book.countDocuments();
        const totalReviews = await Review.countDocuments();
        res.json({
            totalUsers,
            totalBooks,
            totalReviews
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        if (users.length === 0) {
            return res.status(404).json({ msg: "No users found." });
        }

        res.status(200).json({
            totalUsers: users.length,
            users,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        await Review.deleteMany({ user: userId }); 

        await User.findByIdAndDelete(userId);

        res.json({ msg: "User and all their reviews deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




