const User = require("../models/UserModel.js");

// Create User
const createUser = async (req, res) => {
  try {
    const { name, fullName, dob, nic, address, phoneNumber, website, allInfo } = req.body;

    if (!name || !fullName || !dob || !nic || !address || !phoneNumber) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newUser = new User({ name, fullName, dob, nic, address, phoneNumber, website, allInfo });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single User
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { name, fullName, dob, nic, address, phoneNumber, website, allInfo } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, fullName, dob, nic, address, phoneNumber, website, allInfo },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
