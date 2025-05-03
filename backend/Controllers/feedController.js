const Feed = require("../models/FeedModel");

// Create a new feed
const createFeed = async (req, res) => {
  try {
    const { title, content, feeling, location, YourName } = req.body;

    const newFeed = new Feed({
      title,
      content,
      feeling,
      location,
      YourName,
    });

    await newFeed.save();
    res.status(201).json(newFeed);
  } catch (error) {
    res.status(500).json({ message: "Error creating feed", error: error.message });
  }
};

// Get all feeds
const getAllFeeds = async (req, res) => {
  try {
    const feeds = await Feed.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(feeds);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feeds", error: error.message });
  }
};

// Get a single feed by ID
const getFeedById = async (req, res) => {
  try {
    const { id } = req.params;
    const feed = await Feed.findById(id);

    if (!feed) {
      return res.status(404).json({ message: "Feed not found" });
    }

    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feed", error: error.message });
  }
};

// Update a feed
const updateFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, feeling, location, YourName } = req.body;

    const updatedFeed = await Feed.findByIdAndUpdate(
      id,
      { title, content, feeling, location, YourName },
      { new: true, runValidators: true }
    );

    if (!updatedFeed) {
      return res.status(404).json({ message: "Feed not found" });
    }

    res.status(200).json(updatedFeed);
  } catch (error) {
    res.status(500).json({ message: "Error updating feed", error: error.message });
  }
};

// Delete a feed
const deleteFeed = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFeed = await Feed.findByIdAndDelete(id);

    if (!deletedFeed) {
      return res.status(404).json({ message: "Feed not found" });
    }

    res.status(200).json({ message: "Feed deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feed", error: error.message });
  }
};

// Like or unlike a feed
const likeFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { likedByUser, likes } = req.body;

    const updatedFeed = await Feed.findByIdAndUpdate(
      id,
      { likedByUser, likes },
      { new: true }
    );

    if (!updatedFeed) {
      return res.status(404).json({ message: "Feed not found" });
    }

    res.status(200).json(updatedFeed);
  } catch (error) {
    res.status(500).json({ message: "Error updating likes", error: error.message });
  }
};

module.exports = {
  createFeed,
  getAllFeeds,
  getFeedById,
  updateFeed,
  deleteFeed,
  likeFeed, 
};
