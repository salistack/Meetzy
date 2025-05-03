// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // Import the upload middleware
const messageController = require("../Controllers/messageController"); // Import the message controller
const { protect } = require("../middlewares/authMiddleware"); // Assuming you have an auth middleware for protecting routes

// Route to send a message (with file upload support)
router.post("/sendMessage", protect, upload.single("file"), messageController.sendMessage);

// Route to get all messages in a group
router.get("/:groupId", protect, messageController.getMessages);

// Route to mark a message as read
router.put("/mark-as-read/:id", protect, messageController.markAsRead);

// Export the router
module.exports = router;
