const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); 

const broadcastRoutes = require("./routes/BroadcastRoutes");
const blogRoutes = require("./routes/BlogRoutes"); // Import routes
const userRoutes = require("./routes/UserRoutes.js");
const groupRoutes = require("./routes/GroupRoutes");

dotenv.config();
connectDB();

const app = express();

// ✅ Allow frontend requests from localhost:5173 BEFORE routes
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type"]
}));

app.use(cors());

app.use(express.json()); // Middleware to parse JSON
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Updated path


//Apply routes AFTER CORS middleware
app.use("/api/blogs", blogRoutes);
app.use("/api/broadcasts", broadcastRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
