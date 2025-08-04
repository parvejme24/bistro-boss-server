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
} = require("../controllers/MenuController");
const {
  authenticateToken,
  requireChef,
} = require("../middleware/auth");

// Menu routes
router.get("/menus", getAllMenus);
router.get("/menus/best-selling", getBestSellingMenus);
router.get("/menus/category/:categoryId", getMenusByCategory);
router.get("/menus/:id", getMenuById);
router.post("/menus", authenticateToken, requireChef, createMenu);
router.patch("/menus/:id", authenticateToken, requireChef, updateMenu);
router.delete("/menus/:id", authenticateToken, requireChef, deleteMenu);

module.exports = router; 