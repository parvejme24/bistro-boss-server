const express = require("express");
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  deleteMultipleMenuItems,
  getMenuItemsByCategory,
  searchMenuItems,
} = require("../controllers/MenuController");

const menuRouter = express.Router();

menuRouter.post("/menu", createMenuItem);
menuRouter.get("/menu", getMenuItems);
menuRouter.get("/menu/:id", getMenuItemById);
menuRouter.get("/menu/category/:category", getMenuItemsByCategory);
menuRouter.get("/menu/search", searchMenuItems);
menuRouter.put("/menu/:id", updateMenuItem);
menuRouter.delete("/menu/:id", deleteMenuItem);
menuRouter.delete("/menu", deleteMultipleMenuItems);

module.exports = menuRouter;
