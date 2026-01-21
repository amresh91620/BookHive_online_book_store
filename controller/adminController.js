const User = require("../model/User");

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
        const user = await User.findByIdAndDelete(req.params.id);
        res.json({ msg: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


