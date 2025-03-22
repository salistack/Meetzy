const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  rateBlog,  //  Import the new rating function
} = require("../Controllers/BlogController.js");

const router = express.Router();

//  Configure multer for storing uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs/"); // Save images in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

//  Updated Routes with file upload support
router.post("/", upload.single("photo"), createBlog); // Create blog with photo upload
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", upload.single("photo"), updateBlog); // Allow updating blog with a new photo
router.delete("/:id", deleteBlog);

//  New Rating Route
router.post("/:id/rate", rateBlog);  // Allow users to rate a blog

module.exports = router;
