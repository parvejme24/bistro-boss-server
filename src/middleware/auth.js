const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../utils/secret');
const UserModel = require('../models/UserMode');

// Authenticate user by verifying JWT access token
const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found.' });
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Authorize user by role(s)
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient role.' });
  }
  next();
};

module.exports = { authenticate, authorizeRoles }; 