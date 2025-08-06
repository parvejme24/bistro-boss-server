const express = require("express");
const router = express.Router();
const {
  createMenuReview,
  getMenuReviews,
  getMenuReviewById,
  updateMenuReview,
  deleteMenuReview,
} = require("../controllers/menuReviewController");
const { authenticateToken } = require("../middleware/auth");

// Public routes (anyone can view reviews)
router.get("/menus/:menuId/reviews", getMenuReviews);
router.get("/menu-reviews/:reviewId", getMenuReviewById);

// Authenticated routes (require user authentication)
router.post("/menus/:menuId/reviews", authenticateToken, createMenuReview);
router.put("/menu-reviews/:reviewId", authenticateToken, updateMenuReview);
router.delete("/menu-reviews/:reviewId", authenticateToken, deleteMenuReview);

module.exports = router; 