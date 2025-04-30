const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
     
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["lonliness", "Health", "Travel", "Education"], // Default categories
      required: true,
    },
    photo: {
      type: String, // URL for image
    },
    totalRating: { type: Number, default: 0 }, // Store sum of all ratings
    ratingCount: { type: Number, default: 0 }, // Store number of ratings
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

// Calculate average rating
blogSchema.methods.calculateAverageRating = function () {
  return this.ratingCount === 0 ? 0 : this.totalRating / this.ratingCount;
};

module.exports = mongoose.model("Blog", blogSchema);
