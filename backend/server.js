const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); 
const app = express();
<<<<<<< Updated upstream
=======
const blogRoutes = require("./routes/BlogRoutes");
const broadcastRoutes = require("./routes/BroadcastRoutes"); // Import broadcast routes
const groupRoutes = require("./routes/GroupRoutes");
>>>>>>> Stashed changes

dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Updated path

<<<<<<< Updated upstream
=======
app.use("/api/blogs", blogRoutes);
app.use("/api/broadcasts", broadcastRoutes); // Use broadcast routes
app.use("/api/groups", groupRoutes);

>>>>>>> Stashed changes
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});