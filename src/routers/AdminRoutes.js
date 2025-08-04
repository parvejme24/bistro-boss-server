const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getUserStats,
  getSalesStats,
  getContentStats,
  getSystemHealth,
} = require("../controllers/AdminController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/auth");

// Admin dashboard routes (all require admin authentication)
router.get("/admin/dashboard", authenticateToken, requireAdmin, getDashboardStats);
router.get("/admin/users/stats", authenticateToken, requireAdmin, getUserStats);
router.get("/admin/sales/stats", authenticateToken, requireAdmin, getSalesStats);
router.get("/admin/content/stats", authenticateToken, requireAdmin, getContentStats);
router.get("/admin/system/health", authenticateToken, requireAdmin, getSystemHealth);

module.exports = router; 