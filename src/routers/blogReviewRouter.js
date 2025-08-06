const express = require("express");
const router = express.Router();
const {
  createBlogReview,
  getBlogReviews,
  getBlogReviewById,
  updateBlogReview,
  deleteBlogReview,
} = require("../controllers/blogReviewController");
const { authenticateToken } = require("../middleware/auth");

// Public routes (anyone can view reviews)
router.get("/blogs/:blogId/reviews", getBlogReviews);
router.get("/blog-reviews/:reviewId", getBlogReviewById);

// Authenticated routes (require user authentication)
router.post("/blogs/:blogId/reviews", authenticateToken, createBlogReview);
router.put("/blog-reviews/:reviewId", authenticateToken, updateBlogReview);
router.delete("/blog-reviews/:reviewId", authenticateToken, deleteBlogReview);

module.exports = router; 