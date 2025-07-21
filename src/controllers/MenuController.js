const Menu = require('../models/MenuModel');

// get all menu items
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: 'failed to get menus', error: error.message });
  }
};

// get menu item by id
exports.getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id);
    if (!menu) return res.status(404).json({ message: 'menu not found.' });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'failed to get menu', error: error.message });
  }
};

// create menu item (admin/moderator only)
exports.createMenu = async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ message: 'failed to create menu', error: error.message });
  }
};

// update menu item (admin/moderator only)
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByIdAndUpdate(id, req.body, { new: true });
    if (!menu) return res.status(404).json({ message: 'menu not found.' });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'failed to update menu', error: error.message });
  }
};

// delete menu item (admin/moderator only)
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByIdAndDelete(id);
    if (!menu) return res.status(404).json({ message: 'menu not found.' });
    res.json({ message: 'menu deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'failed to delete menu', error: error.message });
  }
};
