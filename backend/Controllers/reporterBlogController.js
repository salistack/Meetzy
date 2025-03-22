const ReporterBlog = require('../models/ReporterBlog');

// Get all reported blogs
exports.getReportedBlogs = async (req, res) => {
    try {
        const reportedBlogs = await ReporterBlog.find().populate('blog');
        res.status(200).json(reportedBlogs);
    } catch (error) {
        console.error('Error fetching reported blogs:', error);
        res.status(500).json({ message: 'Failed to fetch reported blogs.' });
    }
};

// Delete a reported blog
exports.deleteReportedBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const report = await ReporterBlog.findById(id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Delete the report
        await report.remove();

        res.status(200).json({ message: 'Reported blog deleted successfully!' });
    } catch (error) {
        console.error('Error deleting reported blog:', error);
        res.status(500).json({ message: 'Failed to delete reported blog.' });
    }
};
