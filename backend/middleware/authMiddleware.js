const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ CRITICAL FIX: Set both _id and id for compatibility
    req.user = {
      _id: decoded.id,  // Primary MongoDB format
      id: decoded.id,   // Alternative format for compatibility
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ msg: "Invalid token" });
  }
};