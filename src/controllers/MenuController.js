const Menu = require("../models/MenuModel");
const Review = require("../models/ReviewModel");

// Get All Menu Items
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find({}).populate("category", "name").populate("createdBy", "name");
    res.status(200).json({ message: "Menus retrieved", menus, count: menus.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Menu by ID
exports.getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id).populate("category", "name").populate("createdBy", "name");
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.status(200).json({ message: "Menu retrieved", menu });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create Menu (Chef/Admin Only)
exports.createMenu = async (req, res) => {
  try {
    const { name, image, price, discount, shortDescription, description, ingredients, category } = req.body;
    const createdBy = req.user.id;

    const menu = await Menu.create({
      name,
      image,
      price,
      discount,
      shortDescription,
      description,
      ingredients,
      category,
      createdBy,
    });

    const populatedMenu = await Menu.findById(menu._id).populate("category", "name").populate("createdBy", "name");
    res.status(201).json({ message: "Menu created", menu: populatedMenu });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Menu (Chef/Admin Only)
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, price, discount, shortDescription, description, ingredients, category } = req.body;

    const menu = await Menu.findById(id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { name, image, price, discount, shortDescription, description, ingredients, category },
      { new: true, runValidators: true }
    ).populate("category", "name").populate("createdBy", "name");

    res.status(200).json({ message: "Menu updated", menu: updatedMenu });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Menu (Chef/Admin Only)
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByIdAndDelete(id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.status(200).json({ message: "Menu deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Best-Selling Menu Items
exports.getBestSellingMenus = async (req, res) => {
  try {
    // Aggregate to get menus with highest average ratings
    const bestSelling = await Review.aggregate([
      {
        $group: {
          _id: "$menu",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
      {
        $sort: { avgRating: -1, reviewCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Get menu details for the best-selling items
    const menuIds = bestSelling.map((item) => item._id);
    const menus = await Menu.find({ _id: { $in: menuIds } })
      .populate("category", "name")
      .populate("createdBy", "name");

    // Combine menu data with rating data
    const bestSellingMenus = menus.map((menu) => {
      const ratingData = bestSelling.find((item) => item._id.toString() === menu._id.toString());
      return {
        ...menu.toObject(),
        avgRating: ratingData.avgRating,
        reviewCount: ratingData.reviewCount,
      };
    });

    res.status(200).json({ message: "Best-selling menus retrieved", menus: bestSellingMenus });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Menu Items by Category
exports.getMenusByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const menus = await Menu.find({ category: categoryId })
      .populate("category", "name")
      .populate("createdBy", "name");
    
    res.status(200).json({ message: "Menus by category retrieved", menus, count: menus.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 