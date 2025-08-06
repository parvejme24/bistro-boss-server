const BlogReview = require("../models/BlogReviewModel");
const Blog = require("../models/BlogModel");

// Create blog review (authenticated users)
const createBlogReview = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { rating, comment } = req.body;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if user has already reviewed this blog
    const existingReview = await BlogReview.findOne({
      user: req.user._id,
      blog: blogId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this blog" });
    }

    const blogReview = new BlogReview({
      user: req.user._id,
      blog: blogId,
      rating,
      comment: comment || "",
    });

    await blogReview.save();

    // Populate user and blog details
    await blogReview.populate('user', 'name');
    await blogReview.populate('blog', 'title');

    res.status(201).json({
      message: "Blog review created successfully",
      blogReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog review", error: error.message });
  }
};

// Get all reviews for a blog (public)
const getBlogReviews = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { sort = 'createdAt', order = 'desc' } = req.query;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const reviews = await BlogReview.find({ blog: blogId })
      .populate('user', 'name')
      .populate('blog', 'title')
      .sort(sortOptions);

    res.status(200).json({
      message: "Blog reviews retrieved successfully",
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get blog reviews", error: error.message });
  }
};

// Get single blog review by ID (public)
const getBlogReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await BlogReview.findById(reviewId)
      .populate('user', 'name')
      .populate('blog', 'title');

    if (!review) {
      return res.status(404).json({ message: "Blog review not found" });
    }

    res.status(200).json({
      message: "Blog review retrieved successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get blog review", error: error.message });
  }
};

// Update blog review (review owner only)
const updateBlogReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    // Check if review exists
    const existingReview = await BlogReview.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Blog review not found" });
    }

    // Check if user is the review owner
    if (existingReview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own reviews" });
    }

    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    const updatedReview = await BlogReview.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name').populate('blog', 'title');

    res.status(200).json({
      message: "Blog review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog review", error: error.message });
  }
};

// Delete blog review (review owner or admin)
const deleteBlogReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Check if review exists
    const existingReview = await BlogReview.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Blog review not found" });
    }

    // Check if user is the review owner or admin
    if (existingReview.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    await BlogReview.findByIdAndDelete(reviewId);

    res.status(200).json({
      message: "Blog review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog review", error: error.message });
  }
};

module.exports = {
  createBlogReview,
  getBlogReviews,
  getBlogReviewById,
  updateBlogReview,
  deleteBlogReview,
}; 