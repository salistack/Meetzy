const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect } = require("../middlewares/authMiddleware"); // Protect middleware and adminOnly middleware
const { adminOnly } = require("../middlewares/adminOnly"); // Protect middleware and adminOnly middleware

const {
    createGroup,
    getAllGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    removeMember,
    getGroupCount
     // Import the removeMember controller function
} = require("../Controllers/GroupController");

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

router.get('/count', getGroupCount);
// Routes
router
    .route("/")
    .post(protect, upload.single("image"), createGroup) // Protect the creation of group
    .get(getAllGroups); // Anyone can view all groups

router
    .route("/:id")
    .get(getGroupById) // Anyone can view a group
    .put(protect, upload.single("image"), updateGroup) // Protect the update of a group
    .delete(protect, deleteGroup); // Protect the delete of a group

router
    .route("/:id/join")
    .post(protect, joinGroup); // Protect the join action

router
    .route("/:id/leave")
    .post(protect, leaveGroup); // Protect the leave group action

// New route for admins to remove members from the group
router
    .route("/:id/remove/:memberId")
    .post(protect, adminOnly, removeMember); // Admin only route to remove a member from the group



module.exports = router;
