const express = require("express");
const router = express.Router();
const {
  createBlogCategory,
  getAllBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
} = require("../controllers/blogCategoryController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Public routes (anyone can view categories)
router.get("/blog-categories", getAllBlogCategories);
router.get("/blog-categories/:categoryId", getBlogCategoryById);

// Admin only routes (require admin authentication)
router.post("/blog-categories", authenticateToken, requireAdmin, createBlogCategory);
router.put("/blog-categories/:categoryId", authenticateToken, requireAdmin, updateBlogCategory);
router.delete("/blog-categories/:categoryId", authenticateToken, requireAdmin, deleteBlogCategory);

module.exports = router; 