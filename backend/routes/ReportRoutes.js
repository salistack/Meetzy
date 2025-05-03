const express = require("express");
const router = express.Router();
const {
  getReportedBlogs,
  updateReportStatus,
  deleteReport,
  createReport,
  deleteMultipleReports, // Add deleteMultipleReports to the imports
} = require("../Controllers/ReportController");
const { protect } = require("../middlewares/authMiddleware"); // Import protect middleware

router.get("/", getReportedBlogs);
router.put("/:id", updateReportStatus);
router.delete("/:id", deleteReport);
router.post("/", createReport);
router.post("/bulk-delete", protect, deleteMultipleReports); // New route for bulk deletion

module.exports = router;