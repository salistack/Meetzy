// backend/controllers/authController.js

const User = require("../models/UserModel");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/emailService");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Register new user
exports.registerUser = async (req, res) => {
  try {
    console.log(req.body); // Log the incoming request body
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create User
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed in model
    });

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendVerificationEmail(user.email, otp);

    res.status(201).json({ email: user.email });
  } catch (error) {
    console.error(error.message); // Log the error message
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login user
exports.authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      console.log("User found:", user); // Debug log
    }

    if (user && (await user.matchPassword(password))) {
      console.log("User is admin:", user.isAdmin); // Debug log
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false, // Include isAdmin field
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.error("Error during login:", error); // Debug log
    res.status(500).json({ message: error.message });
  }
};

// Add a function to create an admin user
exports.createAdminUser = async (req, res) => {
  try {
    const defaultEmail = "meetzy777@gmail.com";
    const defaultPassword = "meetzy777@gmail.com";

    // Check if the default admin user already exists
    const adminExists = await User.findOne({ email: defaultEmail });

    if (adminExists) {
      return res.status(400).json({ message: "Default admin user already exists" });
    }

    // Create the default admin user
    const adminUser = await User.create({
      name: "Default Admin",
      email: defaultEmail,
      password: defaultPassword,
      isAdmin: true, // Mark as admin
    });

    res.status(201).json({
      message: "Default admin user created successfully",
      adminUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    console.log(req.body); // Debug: Log the incoming request body
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error.message); // Debug: Log the error message
    res.status(500).json({ message: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendVerificationEmail(user.email, otp);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
