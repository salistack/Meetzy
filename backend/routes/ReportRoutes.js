const express = require("express");
const router = express.Router();
const {
  getReportedBlogs,
  updateReportStatus,
  deleteReport,
} = require("../Controllers/ReportController");

router.get("/", getReportedBlogs);
router.put("/:id", updateReportStatus);
router.delete("/:id", deleteReport);

module.exports = router;