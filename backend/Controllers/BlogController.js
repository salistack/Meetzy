const Blog = require("../models/BlogModel.js");
const Report = require("../models/ReportModel");
const jwt = require("jsonwebtoken");

// ✅ Create a Blog
const createBlog = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const photo = req.file ? `/uploads/blogs/${req.file.filename}` : null;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "All fields are required: title, description, category" });
    }

    const newBlog = new Blog({
      title,
      description,
      category,
      photo,
      author: req.user.id,
      totalRating: 0,
      ratingCount: 0
    });

    const blog = await newBlog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email"); // Populate author info
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get a Single Blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name email");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const averageRating = blog.ratingCount > 0
      ? (blog.totalRating / blog.ratingCount).toFixed(1)
      : "No ratings yet";

    res.status(200).json({ ...blog.toObject(), averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update a Blog
const updateBlog = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const photo = req.file ? `/uploads/blogs/${req.file.filename}` : req.body.photo;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this blog" });
    }

    blog.title = title;
    blog.description = description;
    blog.category = category;
    blog.photo = photo;

    const updatedBlog = await blog.save();

    res.status(200).json({
      message: "Blog updated successfully!",
      blog: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete a Blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Rate a Blog
const rateBlog = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.totalRating += rating;
    blog.ratingCount += 1;
    await blog.save();

    res.json({
      message: "Rating added successfully!",
      averageRating: (blog.totalRating / blog.ratingCount).toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Report a blog
const reportBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, reportedBy } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newReport = new Report({
      blogId: id,
      reportedBy: reportedBy || "Anonymous",
      category,
    });

    await newReport.save();

    res.status(201).json({ message: "Blog reported successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  rateBlog,
  reportBlog
};
