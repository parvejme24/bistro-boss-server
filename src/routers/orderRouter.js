const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  getOrderStats,
} = require("../controllers/orderController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// User routes (authenticated)
router.post("/orders", authenticateToken, createOrder);
router.get("/orders", authenticateToken, getUserOrders);
router.get("/orders/:orderId", authenticateToken, getOrderById);
router.put("/orders/:orderId/cancel", authenticateToken, cancelOrder);

// Admin routes
router.get("/admin/orders", authenticateToken, requireAdmin, getAllOrders);
router.put("/admin/orders/:orderId/status", authenticateToken, requireAdmin, updateOrderStatus);
router.get("/admin/orders/stats", authenticateToken, requireAdmin, getOrderStats);

// SSL Commerz payment callbacks (public)
router.post("/orders/payment/success", paymentSuccess);
router.post("/orders/payment/fail", paymentFail);
router.post("/orders/payment/cancel", paymentCancel);
router.post("/orders/payment/ipn", paymentIPN);

module.exports = router; 