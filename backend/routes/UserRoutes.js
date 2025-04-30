const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsers  
} = require("../Controllers/UserController.js");
const { protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUserProfile); 
router.get("/all", getAllUsers); // Route to get all users

module.exports = router;
