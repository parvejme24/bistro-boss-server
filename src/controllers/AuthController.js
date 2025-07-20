const UserModel = require('../models/UserMode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, jwtRefreshSecret } = require('../utils/secret');

// helper to generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    jwtSecret,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    jwtRefreshSecret,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}

// register new user
exports.register = async (req, res) => {
  try {
    const { displayname, email, password } = req.body;
    if (!displayname || !email || !password) {
      return res.status(400).json({ message: 'all fields are required.' });
    }
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'email already in use.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ displayname, email, password: hashedPassword });
    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    res.status(201).json({
      user: { id: user._id, displayname: user.displayname, email: user.email, role: user.role },
      ...tokens,
    });
  } catch (error) {
    res.status(500).json({ message: 'registration failed', error: error.message });
  }
};

// login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password required.' });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'invalid credentials.' });
    }
    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    res.json({
      user: { id: user._id, displayname: user.displayname, email: user.email, role: user.role },
      ...tokens,
    });
  } catch (error) {
    res.status(500).json({ message: 'login failed', error: error.message });
  }
};

// logout user (invalidate refresh token)
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'refresh token required.' });
    }
    const user = await UserModel.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: 'invalid refresh token.' });
    }
    user.refreshToken = null;
    await user.save();
    res.json({ message: 'logged out successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'logout failed', error: error.message });
  }
};

// refresh access token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'refresh token required.' });
    }
    const user = await UserModel.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: 'invalid refresh token.' });
    }
    jwt.verify(refreshToken, jwtRefreshSecret, (err, payload) => {
      if (err) return res.status(403).json({ message: 'invalid refresh token.' });
      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        jwtSecret,
        { expiresIn: '15m' }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: 'token refresh failed', error: error.message });
  }
};
