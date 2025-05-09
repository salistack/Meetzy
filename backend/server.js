require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const messageRoutes = require("./routes/messageRoutes");
let expressListEndpoints;
try {
  expressListEndpoints = require("express-list-endpoints");
} catch (error) {
  console.warn("Warning: 'express-list-endpoints' module not installed.");
  expressListEndpoints = null;
}

// Import DB connection helper
const connectDB = require("./config/db.js");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/ReportRoutes");
const broadcastRoutes = require("./routes/BroadcastRoutes");
const blogRoutes = require("./routes/BlogRoutes");
const groupRoutes = require("./routes/GroupRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feedRoutes = require("./routes/feedRoutes.js");
const userRoutes = require("./routes/UserRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

// Init Express
const app = express();

// CORS Config
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  exposedHeaders: ["Content-Length", "X-Request-Id"]
}));


// Body Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static File Serving
app.use("/uploads/blogs", express.static(path.join(__dirname, "uploads", "blogs")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer Upload Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/blogs/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// File Upload Endpoint
app.post("/api/upload", upload.single("photo"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    res.json({ success: true, imageUrl: `/uploads/blogs/${req.file.filename}` });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: "File upload failed" });
  }
});

// Apply routes
app.use("/api/messages", messageRoutes);
// Main API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/broadcasts", broadcastRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feeds", feedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Health Check Endpoint (from new file)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Print Registered Endpoints
if (expressListEndpoints) {
  console.log("Registered Endpoints:");
  expressListEndpoints(app).forEach(route => {
    console.log(`${route.methods.join(", ")} -> ${route.path}`);
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", {
    path: req.originalUrl,
    method: req.method,
    body: req.body,
    error: err.stack || err.message
  });

  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: process.env.NODE_ENV === "production" ? "Server Error" : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  };

  res.status(statusCode).json(response);
});

// Create Default Admin
const createDefaultAdmin = async () => {
  try {
    const User = require("./models/UserModel");
    const defaultEmail = "meetzy777@gmail.com";
    const defaultPassword = "meetzy777@gmail.com";

    const adminExists = await User.findOne({ email: defaultEmail });
    if (!adminExists) {
      await User.create({
        name: "Default Admin",
        email: defaultEmail,
        password: defaultPassword,
        isAdmin: true,
        verified: true
      });
      console.log("Default admin created successfully");
    }
  } catch (error) {
    console.error("Admin Creation Error:", error.message);
    process.exit(1);
  }
};

// Start Server
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set in .env file");
    }
    await connectDB(); // Only use connectDB for DB connection

    // Wait for mongoose connection to be ready before creating admin
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve, reject) => {
        mongoose.connection.once("open", resolve);
        mongoose.connection.once("error", reject);
      });
    }

    await createDefaultAdmin();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || "development"} mode`);
      console.log(`Listening on port ${PORT}`);
      console.log(`Database: ${mongoose.connection.host}`);
    });
  } catch (error) {
    console.error("Server Startup Error:", error.message);
    process.exit(1);
  }
};

// Only call startServer
startServer();
