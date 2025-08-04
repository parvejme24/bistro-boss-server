const User = require("../models/UserModel");
const Menu = require("../models/MenuModel");

// Get All Chefs (Public)
exports.getAllChefs = async (req, res) => {
  try {
    const chefs = await User.find({ role: "chef" })
      .select("name email image phone role createdAt")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ message: "Chefs retrieved", chefs, count: chefs.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Single Chef with Details and Menus (Public)
exports.getChefById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get chef details
    const chef = await User.findById(id).select("name email image phone role createdAt");
    if (!chef) return res.status(404).json({ message: "Chef not found" });
    
    if (chef.role !== "chef") {
      return res.status(404).json({ message: "User is not a chef" });
    }
    
    // Get all menus created by this chef
    const menus = await Menu.find({ createdBy: id })
      .populate("category", "name")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ 
      message: "Chef details retrieved", 
      chef: {
        ...chef.toObject(),
        menus,
        menuCount: menus.length
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Chef Details (Admin Only)
exports.updateChef = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, image } = req.body;
    
    // Check if user exists and is a chef
    const chef = await User.findById(id);
    if (!chef) return res.status(404).json({ message: "Chef not found" });
    
    if (chef.role !== "chef") {
      return res.status(400).json({ message: "User is not a chef" });
    }
    
    // Update chef details
    const updatedChef = await User.findByIdAndUpdate(
      id,
      { name, email, phone, image },
      { new: true, runValidators: true }
    ).select("name email image phone role createdAt");
    
    res.status(200).json({ message: "Chef updated", chef: updatedChef });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Chefs with Filtering (Admin Only)
exports.getChefsWithFilter = async (req, res) => {
  try {
    const { role, search } = req.query;
    let filter = {};
    
    // Filter by role if specified
    if (role) {
      filter.role = role;
    }
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    const chefs = await User.find(filter)
      .select("name email image phone role createdAt")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ message: "Chefs retrieved", chefs, count: chefs.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete User (Admin Only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Prevent admin from deleting themselves
    if (user.role === "admin" && user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot delete your own admin account" });
    }
    
    // Delete user
    await User.findByIdAndDelete(id);
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Chef Statistics (Admin Only)
exports.getChefStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if chef exists
    const chef = await User.findById(id);
    if (!chef || chef.role !== "chef") {
      return res.status(404).json({ message: "Chef not found" });
    }
    
    // Get chef's menu count
    const menuCount = await Menu.countDocuments({ createdBy: id });
    
    // Get chef's total menu ratings (if you have a rating system)
    const menus = await Menu.find({ createdBy: id });
    const menuIds = menus.map(menu => menu._id);
    
    // You can add more statistics here based on your needs
    // For example: average rating, total reviews, etc.
    
    res.status(200).json({ 
      message: "Chef statistics retrieved", 
      stats: {
        chefId: id,
        chefName: chef.name,
        menuCount,
        totalMenus: menuIds.length,
        // Add more stats as needed
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Chef's Own Profile and Stats (Chef Only)
exports.getChefProfile = async (req, res) => {
  try {
    const chefId = req.user.id;
    
    // Ensure only chefs can access this endpoint
    if (req.user.role !== "chef") {
      return res.status(403).json({ message: "Only chefs can access their profile" });
    }
    
    // Get chef details
    const chef = await User.findById(chefId).select("name email image phone role createdAt");
    if (!chef) {
      return res.status(404).json({ message: "Chef not found" });
    }
    
    // Get chef's menu count
    const menuCount = await Menu.countDocuments({ createdBy: chefId });
    
    // Get chef's menus
    const menus = await Menu.find({ createdBy: chefId })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(5); // Get latest 5 menus
    
    res.status(200).json({ 
      message: "Chef profile retrieved", 
      chef: {
        ...chef.toObject(),
        stats: {
          menuCount,
          totalMenus: menuCount
        },
        recentMenus: menus
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 