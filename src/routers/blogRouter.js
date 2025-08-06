const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
  getBlogsByAuthorId,
} = require("../controllers/blogController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Public routes (anyone can view blogs)
router.get("/blogs", getAllBlogs);
router.get("/blogs/:blogId", getBlogById);
router.get("/blogs/category/:categoryId", getBlogsByCategory);
router.get("/blogs/author/:authorId", getBlogsByAuthorId);

// Admin only routes (require admin authentication)
router.post("/blogs", authenticateToken, requireAdmin, createBlog);
router.put("/blogs/:blogId", authenticateToken, requireAdmin, updateBlog);
router.delete("/blogs/:blogId", authenticateToken, requireAdmin, deleteBlog);

module.exports = router; 