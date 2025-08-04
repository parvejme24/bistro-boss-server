const express = require("express");
const router = express.Router();
const {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  getBestSellingMenus,
  getMenusByCategory,
  getChefMenus,
} = require("../controllers/MenuController");
const {
  authenticateToken,
  requireChef,
  requireChefOnly,
} = require("../middleware/auth");

// Public menu routes
router.get("/menus", getAllMenus);
router.get("/menus/best-selling", getBestSellingMenus);
router.get("/menus/category/:categoryId", getMenusByCategory);
router.get("/menus/:id", getMenuById);

// Chef-only menu management routes
router.get("/chef/menus", authenticateToken, requireChefOnly, getChefMenus);
router.post("/menus", authenticateToken, requireChefOnly, createMenu);
router.patch("/menus/:id", authenticateToken, requireChefOnly, updateMenu);
router.delete("/menus/:id", authenticateToken, requireChefOnly, deleteMenu);

module.exports = router; 