const User = require("../models/UserModel");

// GET logged-in user's profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE logged-in user's profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update only fields that are passed
    user.fullName = req.body.fullName || user.fullName;
    user.dob = req.body.dob || user.dob;
    user.address = req.body.address || user.address;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.website = req.body.website || user.website;
    user.allInfo = req.body.allInfo || user.allInfo;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE logged-in user's profile
// DELETE logged-in user's profile
const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    await User.deleteOne({ _id: req.user._id });

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users (including password — not recommended)

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsers
};