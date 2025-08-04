const express = require("express");
const router = express.Router();
const {
  getAllChefs,
  getChefById,
  updateChef,
  getChefsWithFilter,
  deleteUser,
  getChefStats,
  getChefProfile,
} = require("../controllers/ChefController");
const {
  authenticateToken,
  requireAdmin,
  requireChefOnly,
} = require("../middleware/auth");

// Public chef routes
router.get("/chefs", getAllChefs);
router.get("/chefs/:id", getChefById);

// Chef-only routes
router.get("/chef/profile", authenticateToken, requireChefOnly, getChefProfile);

// Admin-only chef routes
router.get("/chefs/admin/filter", authenticateToken, requireAdmin, getChefsWithFilter);
router.patch("/chefs/:id", authenticateToken, requireAdmin, updateChef);
router.delete("/users/:id", authenticateToken, requireAdmin, deleteUser);
router.get("/chefs/:id/stats", authenticateToken, requireAdmin, getChefStats);

module.exports = router; 