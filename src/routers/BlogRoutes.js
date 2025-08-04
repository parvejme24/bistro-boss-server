const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
  getBlogsByAuthor,
} = require("../controllers/BlogController");
const {
  authenticateToken,
  requireChef,
} = require("../middleware/auth");

// Blog routes
router.get("/blogs", getAllBlogs);
router.get("/blogs/category/:category", getBlogsByCategory);
router.get("/blogs/author/:authorId", getBlogsByAuthor);
router.get("/blogs/:id", getBlogById);
router.post("/blogs", authenticateToken, requireChef, createBlog);
router.patch("/blogs/:id", authenticateToken, updateBlog);
router.delete("/blogs/:id", authenticateToken, deleteBlog);

module.exports = router; 