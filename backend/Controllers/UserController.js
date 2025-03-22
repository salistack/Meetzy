const User = require("../models/UserModel.js");
const { body, validationResult } = require('express-validator');

// Validate fields (this can be placed in a separate validation file if preferred)
const userValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('dob').notEmpty().isDate().withMessage('Valid date of birth is required'),
  body('nic').notEmpty().withMessage('NIC is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('phoneNumber').notEmpty().isMobilePhone().withMessage('A valid phone number is required')
];

// Create User
const createUser = async (req, res) => {
  // Validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, fullName, dob, nic, address, phoneNumber, interest, maritalStatus } = req.body;

    const newUser = new User({ name, fullName, dob, nic, address, phoneNumber, interest, maritalStatus });
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
  // Validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, fullName, dob, nic, address, phoneNumber, interest, maritalStatus } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, fullName, dob, nic, address, phoneNumber, interest, maritalStatus },
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

module.exports = { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  userValidation // Export validation to be used in routes
};
