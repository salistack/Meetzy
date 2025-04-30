const express = require("express");
const router = express.Router();
const {
  createFeed,
  getAllFeeds,
  getFeedById,
  updateFeed,
  deleteFeed
} = require("../Controllers/feedController");

// Basic feed routes
router.post("/", createFeed);
router.get("/", getAllFeeds);
router.get("/:id", getFeedById);
router.put("/:id", updateFeed);
router.delete("/:id", deleteFeed);

module.exports = router;
