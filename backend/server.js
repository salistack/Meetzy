const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const cors = require("cors");

const blogRoutes = require("./routes/BlogRoutes"); // Import routes

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

// ✅ Apply routes AFTER CORS middleware
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
