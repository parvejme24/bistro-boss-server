const express = require("express");
const router = express.Router();
const {
  getReviewsByBlog,
  addBlogReview,
  updateBlogReview,
  deleteBlogReview,
} = require("../controllers/BlogReviewController");
const {
  authenticateToken,
} = require("../middleware/auth");

// Blog Review routes
router.get("/blog-reviews/blog/:blogId", getReviewsByBlog);
router.post("/blog-reviews/blog/:blogId", authenticateToken, addBlogReview);
router.patch("/blog-reviews/:reviewId", authenticateToken, updateBlogReview);
router.delete("/blog-reviews/:reviewId", authenticateToken, deleteBlogReview);

module.exports = router; 