const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,
            required: true,
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
            type: String, // URL for image (to be handled later)
        },
    },
    {
        timestamps: true, // Automatically adds createdAt & updatedAt
    }
);

module.exports = mongoose.model("Blog", blogSchema);
