const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        // Check admin role
        if (decoded.role !== "admin") {
            return res.status(403).json({ msg: "Access denied. Admin only." });
        }
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ msg: "Invalid token" });
    }
};