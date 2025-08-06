const MenuWishlist = require("../models/MenuWishlistModel");
const Menu = require("../models/MenuModel");

// Add menu to wishlist (authenticated users)
const addToWishlist = async (req, res) => {
  try {
    const { menuId } = req.params;

    // Check if menu exists
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Check if already in wishlist
    const existingWishlistItem = await MenuWishlist.findOne({
      user: req.user._id,
      menu: menuId,
    });

    if (existingWishlistItem) {
      return res.status(400).json({ message: "Menu is already in your wishlist" });
    }

    const wishlistItem = new MenuWishlist({
      user: req.user._id,
      menu: menuId,
    });

    await wishlistItem.save();

    // Populate menu details
    await wishlistItem.populate('menu', 'name image price category');

    res.status(201).json({
      message: "Menu added to wishlist successfully",
      wishlistItem,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Menu is already in your wishlist" });
    }
    res.status(500).json({ message: "Failed to add menu to wishlist", error: error.message });
  }
};

// Remove menu from wishlist (authenticated users)
const removeFromWishlist = async (req, res) => {
  try {
    const { menuId } = req.params;

    // Check if menu exists in user's wishlist
    const wishlistItem = await MenuWishlist.findOneAndDelete({
      user: req.user._id,
      menu: menuId,
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: "Menu not found in your wishlist" });
    }

    res.status(200).json({
      message: "Menu removed from wishlist successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove menu from wishlist", error: error.message });
  }
};

// Get user's wishlist (authenticated users)
const getUserWishlist = async (req, res) => {
  try {
    const { sort = 'createdAt', order = 'desc' } = req.query;

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const wishlistItems = await MenuWishlist.find({ user: req.user._id })
      .populate('menu', 'name image price category description')
      .populate('menu.category', 'name')
      .sort(sortOptions);

    res.status(200).json({
      message: "Wishlist retrieved successfully",
      wishlistItems,
      count: wishlistItems.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get wishlist", error: error.message });
  }
};

// Clear user's wishlist (authenticated users)
const clearWishlist = async (req, res) => {
  try {
    const result = await MenuWishlist.deleteMany({ user: req.user._id });

    res.status(200).json({
      message: "Wishlist cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear wishlist", error: error.message });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  clearWishlist,
}; 