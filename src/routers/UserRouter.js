const express = require('express');
const UserController = require('../controllers/UserController');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/:id', authenticate, UserController.getUserProfile);
// Update user profile
router.put('/:id', authenticate, UserController.updateUser);
// Change user role (admin/moderator only)
router.patch('/:id/role', authenticate, authorizeRoles('ADMIN', 'MODERATOR'), UserController.changeUserRole);
// Get all users (admin/moderator only)
router.get('/', authenticate, authorizeRoles('ADMIN', 'MODERATOR'), UserController.getAllUsers);

module.exports = router; 