const jwt = require("jsonwebtoken");
const { jwtSecret, jwtRefreshSecret } = require("./secret");

// Generate access token (short-lived)
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    jwtSecret,
    { expiresIn: "15m" } // 15 minutes
  );
};

// Generate refresh token (long-lived)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    jwtRefreshSecret,
    { expiresIn: "7d" } // 7 days
  );
};

// Verify access token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtRefreshSecret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}; 