const Report = require("../models/ReportModel");
const Blog = require("../models/BlogModel");

// Get all reported blogs
const getReportedBlogs = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("blogId", "title description photo author category") // Ensure all required fields are populated
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update report status
const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actionTaken } = req.body;

    const validStatuses = ["pending", "reviewed", "ignored", "action_taken"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status, actionTaken },
      { new: true }
    ).populate("blogId", "title authorName description photo");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report status updated", report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);
    
    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }
    
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete multiple reports
const deleteMultipleReports = async (req, res) => {
  try {
    const { reportIds } = req.body;

    if (!Array.isArray(reportIds) || reportIds.length === 0) {
      return res.status(400).json({ message: "No report IDs provided." });
    }

    await Report.deleteMany({ _id: { $in: reportIds } });

    res.status(200).json({ message: "Reports deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a report
const createReport = async (req, res) => {
  try {
    const { blogId, category, reportedBy } = req.body;

    // Validate required fields
    if (!blogId || !category || !reportedBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate category
    const validCategories = ["sex", "terrorism", "abuse", "hateSpeech", "fake", "other"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Create the report
    const report = new Report({
      blogId,
      category,
      reportedBy,
    });

    await report.save();
    res.status(201).json({ message: "Report created successfully", report });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getReportedBlogs,
  updateReportStatus,
  deleteReport,
  createReport,
  deleteMultipleReports, // Export the new function
};