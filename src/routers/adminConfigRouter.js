const express = require("express");
const router = express.Router();
const {
  getAdminConfig,
  updateSSLCommerz,
  updatePaymentCollection,
  updateGeneral,
  updateNotifications,
  updateMaintenance,
  getPublicConfig,
  testSSLCommerzConnection,
  resetConfig,
} = require("../controllers/adminConfigController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Admin routes (admin only)
router.get("/admin/config", authenticateToken, requireAdmin, getAdminConfig);
router.put("/admin/config/ssl-commerz", authenticateToken, requireAdmin, updateSSLCommerz);
router.put("/admin/config/payment-collection", authenticateToken, requireAdmin, updatePaymentCollection);
router.put("/admin/config/general", authenticateToken, requireAdmin, updateGeneral);
router.put("/admin/config/notifications", authenticateToken, requireAdmin, updateNotifications);
router.put("/admin/config/maintenance", authenticateToken, requireAdmin, updateMaintenance);
router.post("/admin/config/test-ssl-commerz", authenticateToken, requireAdmin, testSSLCommerzConnection);
router.post("/admin/config/reset", authenticateToken, requireAdmin, resetConfig);

// Public route (for frontend)
router.get("/config", getPublicConfig);

module.exports = router; 