const Menu = require("../models/MenuModel");

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const newItem = new Menu({ ...req.body });
    await newItem.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Menu item created successfully",
        data: newItem,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating menu item", error });
  }
};

// Get all menu items
exports.getMenuItems = async (req, res) => {
  try {
    const items = await Menu.find().populate("reviews");
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching menu items", error });
  }
};

// Get a menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id).populate("reviews");
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching the item", error });
  }
};

// Get menu items by category
exports.getMenuItemsByCategory = async (req, res) => {
  try {
    const items = await Menu.find({ category: req.params.category });
    if (!items.length)
      return res
        .status(404)
        .json({ success: false, message: "No items found for this category" });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching items by category",
        error,
      });
  }
};

// Search menu items by name or category
exports.searchMenuItems = async (req, res) => {
  try {
    const { query } = req.query;
    const items = await Menu.find({
      $or: [
        { name: new RegExp(query, "i") },
        { category: new RegExp(query, "i") },
      ],
    });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error searching menu items", error });
  }
};

// Update menu details
exports.updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await Menu.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedItem)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    res
      .status(200)
      .json({
        success: true,
        message: "Item updated successfully",
        data: updatedItem,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating item", error });
  }
};

// Delete a single menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedItem)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    res
      .status(200)
      .json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting item", error });
  }
};

// Delete multiple menu items
exports.deleteMultipleMenuItems = async (req, res) => {
  try {
    const { ids } = req.body;
    await Menu.deleteMany({ _id: { $in: ids } });
    res
      .status(200)
      .json({ success: true, message: "Items deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting items", error });
  }
};
