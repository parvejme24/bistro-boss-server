const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ message: "Users retrieved", users, count: users.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Single User (Admin/Chef Only)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User retrieved", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update User Role (Admin Only)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["customer", "chef", "admin"];
    if (!validRoles.includes(role)) return res.status(400).json({ message: "Invalid role" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user.id) return res.status(400).json({ message: "Cannot change your own role" });

    user.role = role;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ message: "Role updated", user: userResponse });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, ...rest } = req.body;
    const userId = req.user.id;

    if (email && email !== req.user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, ...rest },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ message: "Current password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Password changed" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 