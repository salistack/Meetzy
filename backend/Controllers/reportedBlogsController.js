const ReporterBlog = require("../models/reporterBlogModal"); // Import model

const getReportedBlogs = async (req, res) => {
    try {
        const reportedBlogs = await ReporterBlog.find().populate("blogId reportedBy", "title name"); // Populate related fields
        res.status(200).json(reportedBlogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reported blogs", error });
    }
};

// Placeholder function to delete a reported blog
const deleteReportedBlog = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Reported blog with ID ${id} deleted` });
};

// Function to report a blog
const reportBlog = (req, res) => {
    const { id } = req.params;
    res.status(201).json({ message: `Blog with ID ${id} has been reported` });
};

const seedReportedBlogs = async (req, res) => {
    try {
        const sampleData = [
            {
                blogId: "64f1a2b3c4d5e6f7g8h9i0j1", // Replace with a valid Blog ID
                reportedBy: "64f1a2b3c4d5e6f7g8h9i0j2", // Replace with a valid User ID
                category: "abuse",
            },
            {
                blogId: "64f1a2b3c4d5e6f7g8h9i0j3", // Replace with a valid Blog ID
                reportedBy: "64f1a2b3c4d5e6f7g8h9i0j4", // Replace with a valid User ID
                category: "hateSpeech",
            },
        ];

        await ReporterBlog.insertMany(sampleData);
        res.status(201).json({ message: "Sample reported blogs added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error seeding reported blogs", error });
    }
};

module.exports = {
    getReportedBlogs,
    deleteReportedBlog,
    reportBlog,
    seedReportedBlogs, // Export the new function
};
