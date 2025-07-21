const express = require('express');
const UserController = require('../controllers/UserController');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const userRouter = express.Router();


userRouter.get('/user/:id', authenticate, UserController.getUserProfile);
userRouter.put('/user/:id', authenticate, UserController.updateUser);
userRouter.patch('/user/:id/role', authenticate, authorizeRoles('ADMIN', 'MODERATOR'), UserController.changeUserRole);
userRouter.get('/user', authenticate, authorizeRoles('ADMIN', 'MODERATOR'), UserController.getAllUsers);

module.exports = userRouter; 