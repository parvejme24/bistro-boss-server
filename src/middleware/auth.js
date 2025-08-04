const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../utils/secret");
const User = require("../models/UserModel");

// Middleware to verify access token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired access token" });
    }

    // Get user from database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Authentication error", error: error.message });
  }
};

// Middleware to check if user has required role
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};

// Specific role middlewares
const requireAdmin = authorizeRole("admin");
const requireChef = authorizeRole("chef", "admin");
const requireChefOnly = authorizeRole("chef"); // Only chefs, not admins
const requireCustomer = authorizeRole("customer", "chef", "admin");

module.exports = {
  authenticateToken,
  authorizeRole,
  requireAdmin,
  requireChef,
  requireChefOnly,
  requireCustomer,
}; 