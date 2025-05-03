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
    const { search } = req.query; // Get the 'search' query parameter

    // If a 'search' term is provided, filter the users
    let users;
    if (search) {
      users = await User.find({
        $or: [
          { fullName: { $regex: search, $options: 'i' } },  // Case-insensitive match for full name
          { email: { $regex: search, $options: 'i' } }       // Case-insensitive match for email
        ]
      });
    } else {
      // If no search term is provided, return all users
      users = await User.find();
    }

    res.status(200).json(users); // Send the filtered or all users back
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
};




module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsers
};