const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  rateBlog,
  reportBlog,
  getFilteredBlogsWithCount // ✅ Import the new function
} = require("../Controllers/BlogController");

const multer = require("multer");
const path = require("path");
const { protect } = require("../middlewares/authMiddleware"); // Auth middleware

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

//  Admin Manage Blogs - No auth
router.get("/admin/blogs", getFilteredBlogsWithCount); // Publicly accessible

// Blog routes
router.post("/", protect, upload.single("photo"), createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", protect, upload.single("photo"), updateBlog);
router.delete("/:id", protect, deleteBlog);
router.post("/:id/rate", rateBlog);
router.post("/:id/report", reportBlog);

module.exports = router;
