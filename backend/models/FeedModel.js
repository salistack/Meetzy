const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    feeling: {
      type: String,
      enum: ["happy", "sad", "excited", "angry", "alone", "neutral"],
      required: true,
    },
    location: { type: String, required: false },
    YourName: { type: String, required: true },
    likes: { type: Number, default: 0 },            // New field
    likedByUser: { type: Boolean, default: false }, // New field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feed", feedSchema);
