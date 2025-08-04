const BlogReview = require("../models/BlogReviewModel");
const Blog = require("../models/BlogModel");

// Get All Reviews for a Blog
exports.getReviewsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const reviews = await BlogReview.find({ blog: blogId })
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Blog reviews retrieved", reviews, count: reviews.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add Review for a Blog (Authenticated User)
exports.addBlogReview = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if user already reviewed this blog
    const existingReview = await BlogReview.findOne({ user: userId, blog: blogId });
    if (existingReview) return res.status(400).json({ message: "You have already reviewed this blog" });

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const review = await BlogReview.create({
      user: userId,
      blog: blogId,
      rating,
      comment,
    });

    const populatedReview = await BlogReview.findById(review._id).populate("user", "name image");
    res.status(201).json({ message: "Blog review added", review: populatedReview });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Blog Review (Review Owner Only)
exports.updateBlogReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Find the review
    const review = await BlogReview.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "You can only update your own review" });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const updatedReview = await BlogReview.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true, runValidators: true }
    ).populate("user", "name image");

    res.status(200).json({ message: "Blog review updated", review: updatedReview });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Blog Review (Review Owner Only)
exports.deleteBlogReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Find the review
    const review = await BlogReview.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own review" });
    }

    await BlogReview.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Blog review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 