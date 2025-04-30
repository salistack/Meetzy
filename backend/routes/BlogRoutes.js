const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  rateBlog,
  reportBlog // Make sure this is imported
} = require("../Controllers/BlogController");
const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Existing routes
router.post("/", upload.single("photo"), createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", upload.single("photo"), updateBlog);
router.delete("/:id", deleteBlog);
router.post("/:id/rate", rateBlog);

// Add report route - make sure it's after all other routes
router.post("/:id/report", reportBlog); // No middleware needed for this route

module.exports = router;