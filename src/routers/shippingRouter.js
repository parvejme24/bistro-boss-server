const express = require("express");
const router = express.Router();
const {
  createShippingZone,
  getAllShippingZones,
  createShippingMethod,
  getShippingMethodsByLocation,
  calculateShippingCharge,
  getAllShippingMethods,
  updateShippingMethod,
  deleteShippingMethod,
} = require("../controllers/shippingController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Public routes
router.get("/shipping/zones", getAllShippingZones);
router.get("/shipping/methods", getShippingMethodsByLocation);
router.post("/shipping/calculate", calculateShippingCharge);

// Admin only routes
router.post("/shipping/zones", authenticateToken, requireAdmin, createShippingZone);
router.post("/shipping/methods", authenticateToken, requireAdmin, createShippingMethod);
router.get("/shipping/methods/all", authenticateToken, requireAdmin, getAllShippingMethods);
router.put("/shipping/methods/:methodId", authenticateToken, requireAdmin, updateShippingMethod);
router.delete("/shipping/methods/:methodId", authenticateToken, requireAdmin, deleteShippingMethod);

module.exports = router; 