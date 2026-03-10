const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("role isBlocked");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }
    if (user.isBlocked) {
      return res.status(403).json({ msg: "Account blocked" });
    }

    req.user = {
      _id: decoded.id,
      id: decoded.id,
      role: user.role || decoded.role,
      isBlocked: user.isBlocked,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ msg: "Invalid token" });
  }
};
