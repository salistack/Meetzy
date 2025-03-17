const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const blogRoutes = require("./routes/BlogRoutes");
const broadcastRoutes = require("./routes/BroadcastRoutes"); // Import broadcast routes

dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRoutes);
app.use("/api/broadcasts", broadcastRoutes); // Use broadcast routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
