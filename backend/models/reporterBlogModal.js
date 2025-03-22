// reporterBlogModal.js
const mongoose = require('mongoose');

const reporterBlogSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog', // Link to the blog being reported
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Link to the user who reported
        required: true
    },
    category: {
        type: String,
        enum: ['sex', 'terrorism', 'abuse', 'hateSpeech', 'fake', 'other'],
        required: true
    },
    reportedAt: {
        type: Date,
        default: Date.now
    }
});

const ReporterBlog = mongoose.model('ReporterBlog', reporterBlogSchema);

module.exports = ReporterBlog;
