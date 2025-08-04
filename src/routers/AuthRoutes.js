const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  refreshToken,
} = require("../controllers/AuthController");
const { authenticateToken } = require("../middleware/auth");

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

module.exports = router;
