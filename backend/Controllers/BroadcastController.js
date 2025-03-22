const Broadcast = require("../models/BroadcastModel.js");

// Create a Broadcast Message
const createBroadcast = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Validation: Check if 'message' is provided in the request body
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Create new broadcast and save it to the database
    const newBroadcast = new Broadcast({ message });
    const broadcast = await newBroadcast.save();
    
    // Return the created broadcast
    res.status(201).json(broadcast);
  } catch (error) {
    // Handle errors and send response with error message
    res.status(500).json({ message: error.message });
  }
};

// Get All Broadcast Messages
const getAllBroadcasts = async (req, res) => {
  try {
    // Retrieve all broadcasts where 'isDeleted' is false and sort by 'createdAt' in descending order
    const broadcasts = await Broadcast.find({ isDeleted: false }).sort({ createdAt: -1 });
    
    // Return the count and list of broadcasts
    res.status(200).json({ count: broadcasts.length, broadcasts });
  } catch (error) {
    // Handle errors and send response with error message
    res.status(500).json({ message: error.message });
  }
};

// Update a Broadcast Message
const updateBroadcast = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Validation: Check if 'message' is provided in the request body
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Find the broadcast by ID and update it with the new message
    const updatedBroadcast = await Broadcast.findByIdAndUpdate(
      req.params.id,
      { message },
      { new: true }
    );

    // Validation: Check if the broadcast exists
    if (!updatedBroadcast) {
      return res.status(404).json({ message: "Broadcast not found" });
    }

    // Return the updated broadcast
    res.status(200).json({
      message: "Broadcast updated successfully!",
      broadcast: updatedBroadcast,
    });
  } catch (error) {
    // Handle errors and send response with error message
    res.status(500).json({ message: error.message });
  }
};

// Delete a Broadcast Message (Soft delete, set isDeleted to true)
const deleteBroadcast = async (req, res) => {
  try {
    // Find the broadcast by ID and mark it as deleted
    const deletedBroadcast = await Broadcast.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    // Validation: Check if the broadcast exists
    if (!deletedBroadcast) {
      return res.status(404).json({ message: "Broadcast not found" });
    }

    // Return success message
    res.status(200).json({ message: "Broadcast deleted successfully" });
  } catch (error) {
    // Handle errors and send response with error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBroadcast, getAllBroadcasts, updateBroadcast, deleteBroadcast };
