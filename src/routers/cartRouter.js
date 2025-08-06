const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  updateShippingAddress,
  applyShippingMethod,
  removeShippingMethod,
} = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

// Cart management routes
router.get("/cart", getCart);
router.post("/cart", addToCart);
router.put("/cart/:menuId", updateCartItem);
router.delete("/cart/:menuId", removeFromCart);
router.delete("/cart", clearCart);

// Shipping management routes
router.put("/cart/shipping/address", updateShippingAddress);
router.post("/cart/shipping/method", applyShippingMethod);
router.delete("/cart/shipping/method", removeShippingMethod);

module.exports = router; 