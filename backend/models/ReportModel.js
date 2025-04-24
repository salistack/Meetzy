const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    reportedBy: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["sex", "terrorism", "abuse", "hateSpeech", "fake", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "ignored", "action_taken"],
      default: "pending",
    },
    actionTaken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);