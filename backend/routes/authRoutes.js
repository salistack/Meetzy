// backend/routes/authRoutes.js

const express = require("express");
const { registerUser, authUser, createAdminUser, verifyOTP, resendOTP } = require("../Controllers/authController");
const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", authUser);

// Route to create admin user
router.post("/create-admin", createAdminUser);

// Routes for OTP verification and resending
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

module.exports = router;
