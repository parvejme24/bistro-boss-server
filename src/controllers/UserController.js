const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");
const Token = require("../models/TokenModel");
const ChefProfile = require("../models/ChefProfile");
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require("../utils/jwtUtils");

// Register user
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    await Token.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    await Token.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Login successful",
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Delete refresh token from database
      await Token.findOneAndDelete({ refreshToken });
    }

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Check if token exists in database
    const tokenDoc = await Token.findOne({ refreshToken });
    if (!tokenDoc) {
      return res.status(403).json({ message: "Refresh token not found" });
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.role);

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Token refresh failed", error: error.message });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    // Get complete user data including all fields except password
    const user = await User.findById(req.user._id).select("-password");
    
    // If user is a chef, get chef profile data
    if (user.role === "chef") {
      const chefProfile = await ChefProfile.findOne({ user: user._id });
      if (chefProfile) {
        user.chefProfile = chefProfile;
      }
    }
    
    res.status(200).json({ 
      message: "Profile retrieved successfully",
      user: user.toObject() // Convert to plain object to include all fields
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile", error: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, image, chefProfile } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (image) updateData.image = image;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    // If user is a chef and chefProfile data is provided, update chef profile
    if (user.role === "chef" && chefProfile) {
      const { displayName, chefImage, chefDescription } = chefProfile;
      
      const chefProfileData = {};
      if (displayName !== undefined) chefProfileData.displayName = displayName;
      if (chefImage !== undefined) chefProfileData.chefImage = chefImage;
      if (chefDescription !== undefined) chefProfileData.chefDescription = chefDescription;

      // Update or create chef profile
      const updatedChefProfile = await ChefProfile.findOneAndUpdate(
        { user: user._id },
        chefProfileData,
        { new: true, upsert: true, runValidators: true }
      );

      user.chefProfile = updatedChefProfile;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    
    // Add chef profile data for chef users
    for (let user of users) {
      if (user.role === "chef") {
        const chefProfile = await ChefProfile.findOne({ user: user._id });
        if (chefProfile) {
          user.chefProfile = chefProfile;
        }
      }
    }
    
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to get users", error: error.message });
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["customer", "chef", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user role", error: error.message });
  }
};



// Update user's own password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    // Get user with password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      { new: true, runValidators: true }
    );

    // Delete all tokens for this user (force re-login)
    await Token.deleteMany({ userId: req.user._id });

    res.status(200).json({
      message: "Password updated successfully. Please login again with your new password.",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password", error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  updatePassword,
  getAllUsers,
  updateUserRole,
}; 