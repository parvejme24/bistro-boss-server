const Blog = require("../models/BlogModel");

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate("author", "name image")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ message: "Blogs retrieved", blogs, count: blogs.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author", "name image");
    
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    
    res.status(200).json({ message: "Blog retrieved", blog });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create Blog (Admin/Chef Only)
exports.createBlog = async (req, res) => {
  try {
    const { title, category, description, image, quote, content } = req.body;
    const author = req.user.id;

    const blog = await Blog.create({
      title,
      category,
      description,
      image,
      quote,
      content,
      author,
    });

    const populatedBlog = await Blog.findById(blog._id).populate("author", "name image");
    res.status(201).json({ message: "Blog created", blog: populatedBlog });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Blog (Blog Author/Admin Only)
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, image, quote, content } = req.body;
    const userId = req.user.id;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if user is author or admin
    if (blog.author.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only update your own blog" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, category, description, image, quote, content },
      { new: true, runValidators: true }
    ).populate("author", "name image");

    res.status(200).json({ message: "Blog updated", blog: updatedBlog });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Blog (Blog Author/Admin Only)
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if user is author or admin
    if (blog.author.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own blog" });
    }

    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Blogs by Category
exports.getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const blogs = await Blog.find({ category })
      .populate("author", "name image")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ message: "Blogs by category retrieved", blogs, count: blogs.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Blogs by Author
exports.getBlogsByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;
    const blogs = await Blog.find({ author: authorId })
      .populate("author", "name image")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ message: "Blogs by author retrieved", blogs, count: blogs.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 