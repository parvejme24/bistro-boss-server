const express = require('express');
const MenuController = require('../controllers/MenuController');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const menuRouter = express.Router();


menuRouter.get('/menu', MenuController.getAllMenus);
menuRouter.get('/menu/:id', MenuController.getMenuById);
menuRouter.post('/menu', authenticate, authorizeRoles('ADMIN', 'MODERATOR'), MenuController.createMenu);
menuRouter.put('/menu/:id', authenticate, authorizeRoles('ADMIN', 'MODERATOR'), MenuController.updateMenu);
menuRouter.delete('/menu/:id', authenticate, authorizeRoles('ADMIN', 'MODERATOR'), MenuController.deleteMenu);

module.exports = menuRouter;
