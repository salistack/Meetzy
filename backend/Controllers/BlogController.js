const Blog = require("../models/BlogModel.js");

// Create a Blog
const createBlog = async (req, res) => {
  try {
    const { title, authorName, description, category, photo } = req.body;
    if (!title || !authorName || !description || !category) {
      return res
        .status(400)
        .json({ message: "All fields are required: title, authorName, description, category" });
    }
    const newBlog = new Blog({ title, authorName, description, category, photo });
    const blog = await newBlog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ count: blogs.length, blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a Single Blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Blog
const updateBlog = async (req, res) => {
  try {
    const { title, authorName, description, category, photo } = req.body;
    if (!title || !authorName || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, authorName, description, category, photo },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog updated successfully!",
      blog: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Blog
const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
