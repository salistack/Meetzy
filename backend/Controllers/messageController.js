const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const Group = require("../models/GroupModel");

// Send a message
const sendMessage = async (req, res) => {
    try {
      // Log the request body and file in a readable format
      console.log("Request Body:", JSON.stringify(req.body, null, 2));
      console.log("Uploaded File:", JSON.stringify(req.file, null, 2));  // Logs the file object clearly
  
      const { groupId, content, messageType } = req.body;
      const senderId = req.user._id;
  
      // Validate groupId format
      if (!groupId || groupId.length !== 24) {
        return res.status(400).json({ message: "Invalid groupId" });
      }
  
      // Handle the uploaded file URL if present
      const fileUrl = req.file ? req.file.path : null;
  
      if (!content && !fileUrl) {
        return res.status(400).json({ message: "Either content or file is required" });
      }
  
      const messageContent = content || fileUrl;
      const type = messageType || (fileUrl ? "file" : "text");
  
      // Create the message
      const message = await Message.create({
        sender: senderId,
        group: groupId,
        content: messageContent,
        messageType: type,
        readBy: [senderId],
      });
  
      // Populate the sender and group details after creation
      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name email")
        .populate("group", "name members");
  
      res.status(201).json(populatedMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({
        message: "Error sending message",
        error: error.message || error.toString(),
      });
    }
  };
  
  
  
// Get all messages in a group
const getMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId || groupId.length !== 24) {
      return res.status(400).json({ message: "Invalid groupId" });
    }

    const messages = await Message.find({ group: groupId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      message: "Error fetching messages",
      error: error.message || error.toString(),
    });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;

    if (!messageId || messageId.length !== 24) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only add user if not already present in readBy
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
      await message.save();
    }

    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({
      message: "Error updating read status",
      error: error.message || error.toString(),
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
};
