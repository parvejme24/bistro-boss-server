const BlogCategory = require("../models/BlogCategoryModel");

// Create blog category (admin only)
const createBlogCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    // Check if category with same name already exists
    const existingCategory = await BlogCategory.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category with this name already exists" });
    }

    const blogCategory = new BlogCategory({
      name,
      image: image || "",
      description: description || "",
    });

    await blogCategory.save();

    res.status(201).json({
      message: "Blog category created successfully",
      blogCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog category", error: error.message });
  }
};

// Get all blog categories
const getAllBlogCategories = async (req, res) => {
  try {
    const blogCategories = await BlogCategory.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      message: "Blog categories retrieved successfully",
      blogCategories,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get blog categories", error: error.message });
  }
};

// Get single blog category by ID
const getBlogCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const blogCategory = await BlogCategory.findById(categoryId);
    if (!blogCategory) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    res.status(200).json({
      message: "Blog category retrieved successfully",
      blogCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get blog category", error: error.message });
  }
};

// Update blog category (admin only)
const updateBlogCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, image, description } = req.body;

    // Check if category exists
    const existingCategory = await BlogCategory.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    // If name is being updated, check for duplicates
    if (name && name !== existingCategory.name) {
      const duplicateCategory = await BlogCategory.findOne({ name });
      if (duplicateCategory) {
        return res.status(400).json({ message: "Category with this name already exists" });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;

    const updatedCategory = await BlogCategory.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Blog category updated successfully",
      blogCategory: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog category", error: error.message });
  }
};

// Delete blog category (admin only)
const deleteBlogCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if category exists
    const existingCategory = await BlogCategory.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    // Check if category has any blogs (blogCount > 0)
    if (existingCategory.blogCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete category that contains blogs. Please remove all blogs from this category first." 
      });
    }

    await BlogCategory.findByIdAndDelete(categoryId);

    res.status(200).json({
      message: "Blog category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog category", error: error.message });
  }
};

module.exports = {
  createBlogCategory,
  getAllBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
}; 