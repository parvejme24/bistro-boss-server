const Category = require("../models/CategoryModel");

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ message: "Categories retrieved", categories, count: categories.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Single Category
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category retrieved", category });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create Category (Admin Only)
exports.createCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({ name, image, description });
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Category (Admin Only)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, description } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (name && name !== category.name) {
      const exists = await Category.findOne({ name });
      if (exists) return res.status(400).json({ message: "Category name already exists" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, image, description },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Category updated", category: updatedCategory });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Category (Admin Only)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 