const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/CategoryController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/auth");

// Category routes
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.post("/categories", authenticateToken, requireAdmin, createCategory);
router.patch("/categories/:id", authenticateToken, requireAdmin, updateCategory);
router.delete("/categories/:id", authenticateToken, requireAdmin, deleteCategory);

module.exports = router; 