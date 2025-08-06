const express = require("express");
const router = express.Router();
const {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  getMenusByCategory,
  getMenusByChefId,
} = require("../controllers/menuController");
const { authenticateToken, requireChef } = require("../middleware/auth");

// Public routes (anyone can view menus)
router.get("/menus", getAllMenus);
router.get("/menus/:menuId", getMenuById);
router.get("/menus/category/:categoryId", getMenusByCategory);
router.get("/menus/chef/:chefId", getMenusByChefId);

// Chef only routes (require chef authentication)
router.post("/menus", authenticateToken, requireChef, createMenu);
router.put("/menus/:menuId", authenticateToken, requireChef, updateMenu);
router.delete("/menus/:menuId", authenticateToken, requireChef, deleteMenu);

module.exports = router; 