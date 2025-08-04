const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/CartController");
const {
  authenticateToken,
} = require("../middleware/auth");

// Cart routes (all require authentication)
router.get("/cart", authenticateToken, getCart);
router.post("/cart", authenticateToken, addToCart);
router.patch("/cart/:itemId", authenticateToken, updateCartItem);
router.delete("/cart/:itemId", authenticateToken, removeFromCart);
router.delete("/cart/clear", authenticateToken, clearCart);

module.exports = router; 