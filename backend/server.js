const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const broadcastRoutes = require("./routes/BroadcastRoutes");
const blogRoutes = require("./routes/BlogRoutes");

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

//  Middleware to parse JSON
app.use(express.json());

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
