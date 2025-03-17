const Broadcast = require("../models/BroadcastModel.js");

// Create a Broadcast Message
const createBroadcast = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const newBroadcast = new Broadcast({ message });
    const broadcast = await newBroadcast.save();
    res.status(201).json(broadcast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Broadcast Messages
const getAllBroadcasts = async (req, res) => {
  try {
    const broadcasts = await Broadcast.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({ count: broadcasts.length, broadcasts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Broadcast Message
const updateBroadcast = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const updatedBroadcast = await Broadcast.findByIdAndUpdate(
      req.params.id,
      { message },
      { new: true }
    );

    if (!updatedBroadcast) {
      return res.status(404).json({ message: "Broadcast not found" });
    }

    res.status(200).json({
      message: "Broadcast updated successfully!",
      broadcast: updatedBroadcast,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Broadcast Message (Soft delete, set isDeleted to true)
const deleteBroadcast = async (req, res) => {
  try {
    const deletedBroadcast = await Broadcast.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedBroadcast) {
      return res.status(404).json({ message: "Broadcast not found" });
    }

    res.status(200).json({ message: "Broadcast deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBroadcast, getAllBroadcasts, updateBroadcast, deleteBroadcast };
