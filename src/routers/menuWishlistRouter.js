const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  clearWishlist,
} = require("../controllers/menuWishlistController");
const { authenticateToken } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

// Wishlist management routes
router.post("/wishlist/:menuId", addToWishlist);
router.delete("/wishlist/:menuId", removeFromWishlist);
router.get("/wishlist", getUserWishlist);
router.delete("/wishlist", clearWishlist);

module.exports = router; 