const express = require("express");
const { registerUser, loginUser, resetPassword } = require("../Controllers/loginAuthController");

const router = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
