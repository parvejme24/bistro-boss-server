const UserModel = require('../models/UserMode');
const fs = require('fs');
const path = require('path');

// check admin or moderator
function isAdminOrModerator(user) {
  return user.role === 'ADMIN' || user.role === 'MODERATOR';
}

// get user profile by user id
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'user not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'failed to get user profile', error: error.message });
  }
};

// update user profile (user can update their own profile)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id && !isAdminOrModerator(req.user)) {
      return res.status(403).json({ message: 'forbidden.' });
    }
    const updateFields = { ...req.body };
    delete updateFields.role;
    delete updateFields.password;
    // handle base64 avatar upload
    if (req.body.photoBase64) {
      const uploadsDir = path.join(__dirname, '../../uploads/avatars');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filename = `avatar_${id}_${Date.now()}.png`;
      const filePath = path.join(uploadsDir, filename);
      const base64Data = req.body.photoBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      fs.writeFileSync(filePath, base64Data, 'base64');
      updateFields.photoUrl = `/uploads/avatars/${filename}`;
    }
    const user = await UserModel.findByIdAndUpdate(id, updateFields, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'user not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'failed to update user', error: error.message });
  }
};

// admin/moderator: change user role
exports.changeUserRole = async (req, res) => {
  try {
    if (!isAdminOrModerator(req.user)) {
      return res.status(403).json({ message: 'forbidden.' });
    }
    const { id } = req.params;
    const { role } = req.body;
    if (!['USER', 'ADMIN', 'MODERATOR'].includes(role)) {
      return res.status(400).json({ message: 'invalid role.' });
    }
    const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'user not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'failed to change user role', error: error.message });
  }
};

// admin/moderator: get all users
exports.getAllUsers = async (req, res) => {
  try {
    if (!isAdminOrModerator(req.user)) {
      return res.status(403).json({ message: 'forbidden.' });
    }
    const users = await UserModel.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'failed to get users', error: error.message });
  }
}; 