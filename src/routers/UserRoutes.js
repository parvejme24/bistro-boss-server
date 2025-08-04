const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserProfile,
  changePassword,
} = require("../controllers/UserController");
const {
  authenticateToken,
  requireAdmin,
  requireChef,
} = require("../middleware/auth");

// User routes
router.get("/users", authenticateToken, requireAdmin, getAllUsers);
router.get("/users/:id", authenticateToken, requireChef, getUserById);
router.patch("/users/:id/role", authenticateToken, requireAdmin, updateUserRole);
router.patch("/users/profile", authenticateToken, updateUserProfile);
router.patch("/users/change-password", authenticateToken, changePassword);

module.exports = router; 