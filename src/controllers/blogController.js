const Blog = require("../models/BlogModel");
const BlogCategory = require("../models/BlogCategoryModel");

// Create blog (admin only)
const createBlog = async (req, res) => {
  try {
    const { title, category, description, image, quote, content } = req.body;

    // Check if blog with same title already exists
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return res.status(400).json({ message: "Blog with this title already exists" });
    }

    // Verify category exists
    const categoryExists = await BlogCategory.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const blog = new Blog({
      title,
      category,
      description,
      image: image || "",
      quote: quote || "",
      content: content || [],
      author: req.user._id,
    });

    await blog.save();

    // Increment blogCount in category
    await BlogCategory.findByIdAndUpdate(category, { $inc: { blogCount: 1 } });

    // Populate category and author details
    await blog.populate('category', 'name');
    await blog.populate('author', 'name');

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog", error: error.message });
  }
};

// Get all blogs (public)
const getAllBlogs = async (req, res) => {
  try {
    const { category, search, sort = 'createdAt', order = 'desc' } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const blogs = await Blog.find(query)
      .populate('category', 'name')
      .populate('author', 'name')
      .sort(sortOptions);
    
    res.status(200).json({
      message: "Blogs retrieved successfully",
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get blogs", error: error.message });
  }
};

// Get single blog by ID (public)
const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId)
      .populate('category', 'name')
      .populate('author', 'name');
      
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog retrieved successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get blog", error: error.message });
  }
};

// Update blog (admin only)
const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, category, description, image, quote, content } = req.body;

    // Check if blog exists
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // If title is being updated, check for duplicates
    if (title && title !== existingBlog.title) {
      const duplicateBlog = await Blog.findOne({ title });
      if (duplicateBlog) {
        return res.status(400).json({ message: "Blog with this title already exists" });
      }
    }

    // If category is being updated, verify it exists
    if (category && category !== existingBlog.category.toString()) {
      const categoryExists = await BlogCategory.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (quote !== undefined) updateData.quote = quote;
    if (content !== undefined) updateData.content = content;

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name').populate('author', 'name');

    // Update category blogCount if category changed
    if (category && category !== existingBlog.category.toString()) {
      // Decrement old category
      await BlogCategory.findByIdAndUpdate(existingBlog.category, { $inc: { blogCount: -1 } });
      // Increment new category
      await BlogCategory.findByIdAndUpdate(category, { $inc: { blogCount: 1 } });
    }

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog", error: error.message });
  }
};

// Delete blog (admin only)
const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Check if blog exists
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await Blog.findByIdAndDelete(blogId);

    // Decrement blogCount in category
    await BlogCategory.findByIdAndUpdate(existingBlog.category, { $inc: { blogCount: -1 } });

    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog", error: error.message });
  }
};

// Get blogs by category (public)
const getBlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { search, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Verify category exists
    const categoryExists = await BlogCategory.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    let query = { category: categoryId };
    
    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const blogs = await Blog.find(query)
      .populate('category', 'name')
      .populate('author', 'name')
      .sort(sortOptions);
    
    res.status(200).json({
      message: "Blogs retrieved successfully",
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get blogs", error: error.message });
  }
};

// Get blogs by author ID (public)
const getBlogsByAuthorId = async (req, res) => {
  try {
    const { authorId } = req.params;
    const { category, search, sort = 'createdAt', order = 'desc' } = req.query;
    
    let query = { author: authorId };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const blogs = await Blog.find(query)
      .populate('category', 'name')
      .populate('author', 'name')
      .sort(sortOptions);
    
    res.status(200).json({
      message: "Blogs retrieved successfully",
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get blogs", error: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
  getBlogsByAuthorId,
}; 