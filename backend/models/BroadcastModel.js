const mongoose = require("mongoose");

const broadcastSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Broadcast", broadcastSchema);
