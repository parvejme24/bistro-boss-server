const Review = require("../models/ReviewModel");
const Menu = require("../models/MenuModel");

// Get All Reviews for a Menu
exports.getReviewsByMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    
    // Check if menu exists
    const menu = await Menu.findById(menuId);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    const reviews = await Review.find({ menu: menuId })
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Reviews retrieved", reviews, count: reviews.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add Review for a Menu (Authenticated User)
exports.addReview = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Check if menu exists
    const menu = await Menu.findById(menuId);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    // Check if user already reviewed this menu
    const existingReview = await Review.findOne({ user: userId, menu: menuId });
    if (existingReview) return res.status(400).json({ message: "You have already reviewed this menu" });

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.create({
      user: userId,
      menu: menuId,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate("user", "name image");
    res.status(201).json({ message: "Review added", review: populatedReview });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Review (Review Owner Only)
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "You can only update your own review" });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true, runValidators: true }
    ).populate("user", "name image");

    res.status(200).json({ message: "Review updated", review: updatedReview });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Review (Review Owner Only)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own review" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 