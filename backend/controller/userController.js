const User = require("../models/User");

const mapUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
  profileImage: user.profileImage || "",
});

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ user: mapUser(user) });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ msg: "Failed to load profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    const { name, phone } = req.body || {};

    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (trimmedName.length < 3) {
        return res
          .status(400)
          .json({ msg: "Name must be at least 3 characters" });
      }
      updates.name = trimmedName;
    }

    if (phone !== undefined) {
      const trimmedPhone = String(phone).trim();
      if (trimmedPhone && !/^[0-9+\-\s]{7,15}$/.test(trimmedPhone)) {
        return res.status(400).json({ msg: "Enter a valid phone number" });
      }
      updates.phone = trimmedPhone;
    }

    if (req.file?.path) {
      updates.profileImage = req.file.path;
    }

    if (Object.keys(updates).length === 0) {
      const currentUser = await User.findById(req.user.id).select("-password");
      if (!currentUser) {
        return res.status(404).json({ msg: "User not found" });
      }
      return res.json({ user: mapUser(currentUser) });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Profile updated successfully", user: mapUser(user) });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ msg: "Failed to update profile" });
  }
};
