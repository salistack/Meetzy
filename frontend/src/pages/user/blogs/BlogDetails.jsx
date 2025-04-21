import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './BlogDetails.css';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportCategory, setReportCategory] = useState("");
    const [isReporting, setIsReporting] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
                setBlog(response.data);
                setAverageRating(response.data.averageRating);
            } catch (error) {
                console.error("Failed to fetch blog", error);
            }
        };
        fetchBlog();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/blogs/${id}`);
            alert("Blog deleted successfully!");
            navigate("/user/blogs");
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Failed to delete blog.");
        }
    };

    const handleRateBlog = async (selectedRating) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/blogs/${id}/rate`, { 
                rating: selectedRating 
            });
            setAverageRating(response.data.averageRating);
            setRating(selectedRating);
            alert(`Thank you for rating! New Average: ${response.data.averageRating}`);
        } catch (error) {
            console.error("Error rating blog:", error);
            alert("Failed to submit rating.");
        }
    };

    const handleReportBlog = async () => {
        if (!reportCategory) {
            alert("Please select a category to report.");
            return;
        }

        setIsReporting(true);
        try {
            await axios.post(`http://localhost:5000/api/blogs/${id}/report`, {
                category: reportCategory,
                reportedBy: "User" // Replace with actual user if you have auth
            });
            alert("Blog reported successfully!");
            setShowReportModal(false);
            setReportCategory("");
        } catch (error) {
            console.error("Error reporting blog:", error);
            alert(error.response?.data?.message || "Failed to report the blog.");
        } finally {
            setIsReporting(false);
        }
    };

    const toggleDarkMode = () => {
        const newTheme = darkMode ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    if (!blog) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className={`min-h-screen flex flex-col items-center ${darkMode ? "bg-gray-900" : "bg-gray-100"} p-4 md:p-8 transition-colors duration-300`}>
            {/* Dark Mode Toggle */}
            <button
                onClick={toggleDarkMode}
                className={`self-end mb-4 py-2 px-4 rounded-md shadow-md transition duration-300 ${
                    darkMode 
                        ? "bg-indigo-700 hover:bg-indigo-600 text-white" 
                        : "bg-white hover:bg-gray-200 text-gray-800"
                }`}
            >
                {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* Blog Content */}
            <div className={`w-full max-w-4xl rounded-lg shadow-lg overflow-hidden ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}>
                {/* Blog Header */}
                <div className="p-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{blog.title}</h2>
                    <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        By {blog.authorName}
                    </p>
                </div>

                {/* Blog Image */}
                {blog.photo && (
                    <div className="w-full h-64 md:h-96 overflow-hidden">
                        <img 
                            src={`http://localhost:5000${blog.photo}`} 
                            alt={blog.title} 
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                        />
                    </div>
                )}

                {/* Blog Description */}
                <div className="p-6">
                    <p className="text-lg leading-relaxed whitespace-pre-line">
                        {blog.description}
                    </p>
                </div>

                {/* Rating Section */}
                <div className="p-6 border-t border-b border-opacity-20">
                    <div className="flex flex-col items-center mb-4">
                        <p className="text-xl font-semibold mb-2">
                            ⭐ Average Rating: {averageRating || "No ratings yet"}
                        </p>
                        <div className="flex items-center">
                            <p className="mr-4">Rate this blog:</p>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="text-2xl focus:outline-none"
                                        onClick={() => handleRateBlog(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        {star <= (hoverRating || rating) ? "⭐" : "☆"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 flex flex-wrap gap-4 justify-center">
                    <button 
                        onClick={() => navigate(`/user/blogs/edit/${id}`)}
                        className={`py-2 px-6 rounded-md transition duration-300 ${
                            darkMode 
                                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                    >
                        Edit
                    </button>
                    <button 
                        onClick={handleDelete}
                        className={`py-2 px-6 rounded-md transition duration-300 ${
                            darkMode 
                                ? "bg-red-600 hover:bg-red-700 text-white" 
                                : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => setShowReportModal(true)}
                        className={`py-2 px-6 rounded-md transition duration-300 ${
                            darkMode 
                                ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
                                : "bg-yellow-500 hover:bg-yellow-600 text-white"
                        }`}
                    >
                        Report
                    </button>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4">
                    <div className={`w-full max-w-md rounded-lg shadow-xl ${
                        darkMode ? "bg-gray-800" : "bg-white"
                    }`}>
                        <div className="p-6">
                            <h3 className={`text-xl font-bold mb-4 ${
                                darkMode ? "text-white" : "text-gray-800"
                            }`}>
                                Report Blog
                            </h3>
                            <p className={`mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Please select a reason for reporting:
                            </p>
                            <select
                                value={reportCategory}
                                onChange={(e) => setReportCategory(e.target.value)}
                                className={`w-full p-3 rounded-md border ${
                                    darkMode 
                                        ? "bg-gray-700 border-gray-600 text-white" 
                                        : "bg-white border-gray-300 text-gray-800"
                                }`}
                            >
                                <option value="">-- Select a reason --</option>
                                <option value="sex">Inappropriate Content (Sexual)</option>
                                <option value="terrorism">Violence or Terrorism</option>
                                <option value="abuse">Harassment or Abuse</option>
                                <option value="hateSpeech">Hate Speech</option>
                                <option value="fake">False Information</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="flex justify-end gap-4 mt-6">
                                <button 
                                    onClick={() => setShowReportModal(false)}
                                    className={`py-2 px-4 rounded-md ${
                                        darkMode 
                                            ? "bg-gray-600 hover:bg-gray-500 text-white" 
                                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleReportBlog}
                                    disabled={isReporting || !reportCategory}
                                    className={`py-2 px-4 rounded-md ${
                                        isReporting 
                                            ? "bg-gray-500 text-white" 
                                            : darkMode 
                                                ? "bg-red-600 hover:bg-red-500 text-white" 
                                                : "bg-red-500 hover:bg-red-400 text-white"
                                    }`}
                                >
                                    {isReporting ? "Submitting..." : "Submit Report"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogDetails;