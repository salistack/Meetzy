const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  rateBlog,
  reportBlog
} = require("../Controllers/BlogController");
const multer = require("multer");
const path = require("path");
const { protect } = require("../middlewares/authMiddleware"); // Import the protect middleware

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post("/", protect, upload.single("photo"), createBlog); // Protected route
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", protect, upload.single("photo"), updateBlog); // Protected route
router.delete("/:id", protect, deleteBlog); // Protected route
router.post("/:id/rate", rateBlog);
router.post("/:id/report", reportBlog);

module.exports = router;
