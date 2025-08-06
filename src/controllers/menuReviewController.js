const MenuReview = require("../models/MenuReviewModel");
const Menu = require("../models/MenuModel");

// Create menu review (authenticated users)
const createMenuReview = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { rating, comment } = req.body;

    // Check if menu exists
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Check if user has already reviewed this menu
    const existingReview = await MenuReview.findOne({
      user: req.user._id,
      menu: menuId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this menu" });
    }

    const menuReview = new MenuReview({
      user: req.user._id,
      menu: menuId,
      rating,
      comment: comment || "",
    });

    await menuReview.save();

    // Populate user and menu details
    await menuReview.populate('user', 'name');
    await menuReview.populate('menu', 'name');

    res.status(201).json({
      message: "Menu review created successfully",
      menuReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create menu review", error: error.message });
  }
};

// Get all reviews for a menu (public)
const getMenuReviews = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { sort = 'createdAt', order = 'desc' } = req.query;

    // Check if menu exists
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const reviews = await MenuReview.find({ menu: menuId })
      .populate('user', 'name')
      .populate('menu', 'name')
      .sort(sortOptions);

    res.status(200).json({
      message: "Menu reviews retrieved successfully",
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get menu reviews", error: error.message });
  }
};

// Get single menu review by ID (public)
const getMenuReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await MenuReview.findById(reviewId)
      .populate('user', 'name')
      .populate('menu', 'name');

    if (!review) {
      return res.status(404).json({ message: "Menu review not found" });
    }

    res.status(200).json({
      message: "Menu review retrieved successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get menu review", error: error.message });
  }
};

// Update menu review (review owner only)
const updateMenuReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    // Check if review exists
    const existingReview = await MenuReview.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Menu review not found" });
    }

    // Check if user is the review owner
    if (existingReview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own reviews" });
    }

    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    const updatedReview = await MenuReview.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name').populate('menu', 'name');

    res.status(200).json({
      message: "Menu review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update menu review", error: error.message });
  }
};

// Delete menu review (review owner or admin)
const deleteMenuReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Check if review exists
    const existingReview = await MenuReview.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Menu review not found" });
    }

    // Check if user is the review owner or admin
    if (existingReview.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    await MenuReview.findByIdAndDelete(reviewId);

    res.status(200).json({
      message: "Menu review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete menu review", error: error.message });
  }
};

module.exports = {
  createMenuReview,
  getMenuReviews,
  getMenuReviewById,
  updateMenuReview,
  deleteMenuReview,
}; 