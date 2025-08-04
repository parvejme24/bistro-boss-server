const User = require("../models/UserModel");
const Token = require("../models/TokenModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtRefreshSecret } = require("../utils/secret");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, ...rest } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, ...rest });

    const accessToken = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, jwtRefreshSecret, { expiresIn: "7d" });

    // Save refresh token
    await Token.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({ message: "User registered", accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, jwtRefreshSecret, { expiresIn: "7d" });

    // Save refresh token
    await Token.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.status(200).json({ message: "Login successful", accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Current User
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ message: "User data retrieved", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Logout User
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await Token.findOneAndDelete({ refreshToken });
    }
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    const decoded = jwt.verify(refreshToken, jwtRefreshSecret);
    if (!decoded) return res.status(401).json({ message: "Invalid refresh token" });

    const tokenDoc = await Token.findOne({ refreshToken });
    if (!tokenDoc) return res.status(401).json({ message: "Token not found" });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ id: user._id }, jwtRefreshSecret, { expiresIn: "7d" });

    // Update token in database
    tokenDoc.refreshToken = newRefreshToken;
    tokenDoc.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await tokenDoc.save();

    res.status(200).json({ message: "Token refreshed", accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
