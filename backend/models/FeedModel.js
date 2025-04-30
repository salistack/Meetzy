const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    feeling: {
      type: String,
      enum: ["happy", "sad", "excited", "angry", "neutral"], // you can add more feelings
      required: true,
    },
    location: { type: String, required: false }, // optional field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feed", feedSchema);
