const express = require("express");
const router = express.Router();
const {
  createMenuCategory,
  getAllMenuCategories,
  getMenuCategoryById,
  updateMenuCategory,
  deleteMenuCategory,
  getMenuCategoriesByChef,
} = require("../controllers/menuCategoryController");
const { authenticateToken, requireChef } = require("../middleware/auth");

// Public routes (anyone can view categories)
router.get("/menu-categories", getAllMenuCategories);
router.get("/menu-categories/:categoryId", getMenuCategoryById);

// Chef only routes (require chef authentication)
router.post("/menu-categories", authenticateToken, requireChef, createMenuCategory);
router.put("/menu-categories/:categoryId", authenticateToken, requireChef, updateMenuCategory);
router.delete("/menu-categories/:categoryId", authenticateToken, requireChef, deleteMenuCategory);
router.get("/chef/menu-categories", authenticateToken, requireChef, getMenuCategoriesByChef);

module.exports = router; 