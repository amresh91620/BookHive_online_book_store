module.exports = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  if (user.isBlocked) {
    return res.status(403).json({ msg: "Account blocked" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admin only." });
  }

  next();
};
