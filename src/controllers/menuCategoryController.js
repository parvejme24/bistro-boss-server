const MenuCategory = require("../models/MenuCategoryModel");

// Create menu category (chef only)
const createMenuCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    // Check if category with same name already exists
    const existingCategory = await MenuCategory.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category with this name already exists" });
    }

    const menuCategory = new MenuCategory({
      name,
      image: image || "",
      description: description || "",
    });

    await menuCategory.save();

    res.status(201).json({
      message: "Menu category created successfully",
      menuCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create menu category", error: error.message });
  }
};

// Get all menu categories
const getAllMenuCategories = async (req, res) => {
  try {
    const menuCategories = await MenuCategory.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      message: "Menu categories retrieved successfully",
      menuCategories,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get menu categories", error: error.message });
  }
};

// Get single menu category by ID
const getMenuCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const menuCategory = await MenuCategory.findById(categoryId);
    if (!menuCategory) {
      return res.status(404).json({ message: "Menu category not found" });
    }

    res.status(200).json({
      message: "Menu category retrieved successfully",
      menuCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get menu category", error: error.message });
  }
};

// Update menu category (chef only)
const updateMenuCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, image, description } = req.body;

    // Check if category exists
    const existingCategory = await MenuCategory.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Menu category not found" });
    }

    // If name is being updated, check for duplicates
    if (name && name !== existingCategory.name) {
      const duplicateCategory = await MenuCategory.findOne({ name });
      if (duplicateCategory) {
        return res.status(400).json({ message: "Category with this name already exists" });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;

    const updatedCategory = await MenuCategory.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Menu category updated successfully",
      menuCategory: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update menu category", error: error.message });
  }
};

// Delete menu category (chef only)
const deleteMenuCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if category exists
    const existingCategory = await MenuCategory.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Menu category not found" });
    }

    // Check if category has any menus (menuCount > 0)
    if (existingCategory.menuCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete category that contains menus. Please remove all menus from this category first." 
      });
    }

    await MenuCategory.findByIdAndDelete(categoryId);

    res.status(200).json({
      message: "Menu category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete menu category", error: error.message });
  }
};

// Get menu categories by chef (chef only)
const getMenuCategoriesByChef = async (req, res) => {
  try {
    const menuCategories = await MenuCategory.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      message: "Menu categories retrieved successfully",
      menuCategories,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get menu categories", error: error.message });
  }
};

module.exports = {
  createMenuCategory,
  getAllMenuCategories,
  getMenuCategoryById,
  updateMenuCategory,
  deleteMenuCategory,
  getMenuCategoriesByChef,
}; 