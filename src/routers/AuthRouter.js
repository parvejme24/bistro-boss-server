const express = require("express");
const {
  register,
  login,
  logout,
  refreshToken,
} = require("../controllers/AuthController");
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/refresh-token", refreshToken);

module.exports = authRouter;
