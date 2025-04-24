require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); 
const multer = require("multer");
const authRoutes = require("./routes/loginAuthRoutes");
const reportRoutes = require("./routes/ReportRoutes");
const broadcastRoutes = require("./routes/BroadcastRoutes");
const blogRoutes = require("./routes/BlogRoutes"); // Import routes
const userRoutes = require("./routes/UserRoutes.js");
const groupRoutes = require("./routes/GroupRoutes");
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB();

const app = express();

// ✅ Allow frontend requests from localhost:5173
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
}));

// Serve uploaded images statically
app.use("/uploads/blogs", express.static(path.join(__dirname, "uploads", "blogs")));

app.use(express.json()); // Middleware to parse JSON
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Updated path

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Ensure JSON parsing middleware is applied

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs/"); // ✅ Corrected path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

//  Image Upload Route
app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ imageUrl: `/uploads/blogs/${req.file.filename}` }); // ✅ Corrected URL
});

// Apply routes
app.use("/api/blogs", blogRoutes);
app.use("/api/broadcasts", broadcastRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
