const Menu = require("../models/MenuModel");
const MenuCategory = require("../models/MenuCategoryModel");

// Create menu item (chef only)
const createMenu = async (req, res) => {
  try {
    const { name, image, category, price, recipe, description } = req.body;

    // Check if menu with same name already exists
    const existingMenu = await Menu.findOne({ name });
    if (existingMenu) {
      return res.status(400).json({ message: "Menu item with this name already exists" });
    }

    // Verify category exists
    const categoryExists = await MenuCategory.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const menu = new Menu({
      name,
      image: image || "",
      category,
      price,
      recipe: recipe || "",
      description: description || "",
      createdBy: req.user._id,
    });

    await menu.save();

    // Increment menuCount in category
    await MenuCategory.findByIdAndUpdate(category, { $inc: { menuCount: 1 } });

    // Populate category details
    await menu.populate('category', 'name');

    res.status(201).json({
      message: "Menu item created successfully",
      menu,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create menu item", error: error.message });
  }
};

// Get all menu items
const getAllMenus = async (req, res) => {
  try {
    const { category, search, sort = 'createdAt', order = 'desc' } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const menus = await Menu.find(query)
      .populate('category', 'name')
      .populate('createdBy', 'name')
      .sort(sortOptions);
    
    res.status(200).json({
      message: "Menu items retrieved successfully",
      menus,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get menu items", error: error.message });
  }
};

// Get single menu item by ID
const getMenuById = async (req, res) => {
  try {
    const { menuId } = req.params;

    const menu = await Menu.findById(menuId)
      .populate('category', 'name')
      .populate('createdBy', 'name');
      
    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item retrieved successfully",
      menu,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get menu item", error: error.message });
  }
};

// Update menu item (chef only)
const updateMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { name, image, category, price, recipe, description } = req.body;

    // Check if menu exists
    const existingMenu = await Menu.findById(menuId);
    if (!existingMenu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Check if user is the creator or admin
    if (existingMenu.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You can only update your own menu items" });
    }

    // If name is being updated, check for duplicates
    if (name && name !== existingMenu.name) {
      const duplicateMenu = await Menu.findOne({ name });
      if (duplicateMenu) {
        return res.status(400).json({ message: "Menu item with this name already exists" });
      }
    }

    // If category is being updated, verify it exists
    if (category && category !== existingMenu.category.toString()) {
      const categoryExists = await MenuCategory.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (recipe !== undefined) updateData.recipe = recipe;
    if (description !== undefined) updateData.description = description;

    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name').populate('createdBy', 'name');

    // Update category menuCount if category changed
    if (category && category !== existingMenu.category.toString()) {
      // Decrement old category
      await MenuCategory.findByIdAndUpdate(existingMenu.category, { $inc: { menuCount: -1 } });
      // Increment new category
      await MenuCategory.findByIdAndUpdate(category, { $inc: { menuCount: 1 } });
    }

    res.status(200).json({
      message: "Menu item updated successfully",
      menu: updatedMenu,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update menu item", error: error.message });
  }
};

// Delete menu item (chef only)
const deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.params;

    // Check if menu exists
    const existingMenu = await Menu.findById(menuId);
    if (!existingMenu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Check if user is the creator or admin
    if (existingMenu.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You can only delete your own menu items" });
    }

    await Menu.findByIdAndDelete(menuId);

    // Decrement menuCount in category
    await MenuCategory.findByIdAndUpdate(existingMenu.category, { $inc: { menuCount: -1 } });

    res.status(200).json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete menu item", error: error.message });
  }
};

// Get menu items by chef (chef only)
const getMenusByChef = async (req, res) => {
  try {
    const { category, search, sort = 'createdAt', order = 'desc' } = req.query;
    
    let query = { createdBy: req.user._id };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const menus = await Menu.find(query)
      .populate('category', 'name')
      .sort(sortOptions);
    
    res.status(200).json({
      message: "Menu items retrieved successfully",
      menus,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get menu items", error: error.message });
  }
};

// Get menu items by category
const getMenusByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { search, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Verify category exists
    const categoryExists = await MenuCategory.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    let query = { category: categoryId };
    
    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const menus = await Menu.find(query)
      .populate('category', 'name')
      .populate('createdBy', 'name')
      .sort(sortOptions);
    
    res.status(200).json({
      message: "Menu items retrieved successfully",
      menus,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get menu items", error: error.message });
  }
};

// Get menu items by chef ID (public)
const getMenusByChefId = async (req, res) => {
  try {
    const { chefId } = req.params;
    const { category, search, sort = 'createdAt', order = 'desc' } = req.query;
    
    let query = { createdBy: chefId };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const menus = await Menu.find(query)
      .populate('category', 'name')
      .populate('createdBy', 'name')
      .sort(sortOptions);
    
    res.status(200).json({
      message: "Menu items retrieved successfully",
      menus,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get menu items", error: error.message });
  }
};

module.exports = {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  getMenusByChef,
  getMenusByCategory,
  getMenusByChefId,
}; 