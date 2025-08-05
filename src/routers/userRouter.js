const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  updatePassword,
  getAllUsers,
  updateUserRole,
} = require("../controllers/userController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

// Protected routes (require authentication)
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.put("/password", authenticateToken, updatePassword);

// Admin only routes
router.get("/all", authenticateToken, requireAdmin, getAllUsers);
router.put("/:userId/role", authenticateToken, requireAdmin, updateUserRole);

module.exports = router; 