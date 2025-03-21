const express = require("express");
const multer = require("multer");
const path = require("path");
const { createGroup, getAllGroups, getGroupById, updateGroup, deleteGroup, joinGroup } = require("../Controllers/GroupController");

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/groupUploads/"); // Change the folder to 'uploads/groupuploads/'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename using the current timestamp and file extension
    }
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createGroup); // Upload single image for creating a group
router.get("/", getAllGroups); // Get all groups
router.get("/:id", getGroupById); // Get a specific group by ID
router.put("/:id", upload.single("image"), updateGroup); // Update group with optional image upload
router.delete("/:id", deleteGroup); // Delete a group by ID
router.post("/:id/join", joinGroup); // Add user to group

module.exports = router;
