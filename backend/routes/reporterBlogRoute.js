const express = require('express');
const { getReportedBlogs, deleteReportedBlog, reportBlog, seedReportedBlogs } = require('../Controllers/reportedBlogsController');
const router = express.Router();

// Route to get all reported blogs
router.get('/', getReportedBlogs); // Change '/reportedBlogs' to '/' for consistency

// Route to delete a reported blog
router.delete('/reportedBlogs/:id', deleteReportedBlog);

// Route to report a blog
router.post('/blogs/:id/report', reportBlog);

// Route to seed sample reported blogs
router.post('/seed', seedReportedBlogs);

module.exports = router;
