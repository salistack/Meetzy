// backend/routes/authRoutes.js

const express = require("express");
const { registerUser, authUser } = require("../Controllers/authController");
const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", authUser);

module.exports = router;
