const Report = require("../models/ReportModel");
const Blog = require("../models/BlogModel");

// Get all reported blogs
const getReportedBlogs = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("blogId", "title authorName description photo")
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

module.exports = {
  getReportedBlogs,
  updateReportStatus,
  deleteReport,
};