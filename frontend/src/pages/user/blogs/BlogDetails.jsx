import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
    const [isAuthor, setIsAuthor] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setUserId(decoded.id);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
                setBlog(response.data);
                setAverageRating(response.data.averageRating);
                
                // Check if current user is the author
                if (token && response.data.author._id === userId) {
                    setIsAuthor(true);
                }
            } catch (error) {
                console.error("Failed to fetch blog", error);
            }
        };
        fetchBlog();
    }, [id, userId]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Blog deleted successfully!");
            navigate("/blogs");
        } catch (error) {
            console.error("Error deleting blog:", error);
            if (error.response?.status === 403) {
                alert("You are not authorized to delete this blog");
            } else {
                alert("Failed to delete blog.");
            }
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
            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:5000/api/reports`, {
                blogId: id, // Include the blogId in the request
                category: reportCategory,
                reportedBy: userId || "Anonymous",
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
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
        
        // Add custom CSS variables for the theme color
        document.documentElement.style.setProperty('--primary-color', '#42f5ad');
        document.documentElement.style.setProperty('--primary-hover', '#35d696');
    }, [darkMode]);

    if (!blog) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4" style={{ borderColor: "#42f5ad" }}></div>
        </div>
    );

    return (
        <div className={`min-h-screen flex flex-col items-center ${darkMode ? "bg-gray-900" : "bg-gray-50"} p-4 md:p-8 transition-colors duration-500`}>
            {/* Dark Mode Toggle */}
            <div className="w-full max-w-4xl flex justify-end mb-6">
                <button
                    onClick={toggleDarkMode}
                    className={`py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                        darkMode 
                            ? "bg-emerald-400 hover:bg-emerald-300 text-gray-900" 
                            : "bg-emerald-400 hover:bg-emerald-300 text-gray-900"
                    }`}
                    style={{ backgroundColor: "#42f5ad" }}
                >
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>
            </div>

            {/* Blog Content */}
            <div className={`w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
                {/* Blog Header */}
                <div className="p-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{blog.title}</h2>
                    <div className={`flex items-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="text-lg font-medium">By {blog.author?.name || 'Unknown Author'}</span>
                    </div>
                </div>

                {/* Blog Image */}
                {blog.photo && (
                    <div className="w-full h-72 md:h-96 overflow-hidden">
                        <img 
                            src={`http://localhost:5000${blog.photo}`} 
                            alt={blog.title} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            crossOrigin="anonymous"
                        />
                    </div>
                )}

                {/* Blog Description */}
                <div className="p-8">
                    <p className="text-lg leading-relaxed whitespace-pre-line">
                        {blog.description}
                    </p>
                </div>

                {/* Rating Section */}
                <div className={`p-8 ${darkMode ? "bg-gray-700" : "bg-gray-50"} border-t border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex flex-col items-center">
                        <p className="text-xl font-semibold mb-4">
                            {averageRating ? (
                                <span className="flex items-center gap-2">
                                    <span style={{ color: "#42f5ad" }} className="text-2xl">⭐</span> 
                                    <span>Average Rating: {averageRating}</span>
                                </span>
                            ) : (
                                "No ratings yet"
                            )}
                        </p>
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <p className="font-medium">Rate this blog:</p>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="text-3xl focus:outline-none transition-transform duration-200 hover:scale-110 px-1"
                                        onClick={() => handleRateBlog(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        {star <= (hoverRating || rating) ? (
                                            <span style={{ color: "#42f5ad" }}>⭐</span>
                                        ) : (
                                            <span className="text-gray-400">☆</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Only show if user is the author */}
                {isAuthor && (
                    <div className="p-8 flex flex-wrap gap-4 justify-center">
                        <button 
                            onClick={() => navigate(`/blogs/edit/${id}`)}
                            className="py-3 px-8 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 text-gray-900"
                            style={{ backgroundColor: "#42f5ad" }}
                        >
                            Edit Blog
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="py-3 px-8 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 text-gray-900"
                            style={{ backgroundColor: "#42f5ad" }}
                        >
                            Delete Blog
                        </button>
                    </div>
                )}

                {/* Report Button - Show for all users */}
                <div className="p-6 flex justify-center">
                    <button 
                        onClick={() => setShowReportModal(true)}
                        className="py-2 px-6 rounded-full font-medium transition-all duration-300 text-gray-900"
                        style={{ backgroundColor: "#42f5ad" }}
                    >
                        Report this blog
                    </button>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-sm transition-opacity duration-300">
                    <div 
                        className={`w-full max-w-md rounded-xl shadow-2xl transform transition-all duration-300 ${
                            darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                    >
                        <div className="p-8">
                            <h3 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                                Report Blog
                            </h3>
                            <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Please select a reason for reporting:
                            </p>
                            <select
                                value={reportCategory}
                                onChange={(e) => setReportCategory(e.target.value)}
                                className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200 ${
                                    darkMode 
                                        ? "bg-gray-700 border-gray-600 text-white" 
                                        : "bg-white border-gray-300 text-gray-800"
                                }`}
                                style={{ 
                                    borderColor: "#42f5ad", 
                                    "--tw-ring-color": "#42f5ad"
                                }}
                            >
                                <option value="">-- Select a reason --</option>
                                <option value="sex">Sexual Content</option>
                                <option value="terrorism">Terrorism</option>
                                <option value="abuse">Abuse</option>
                                <option value="hateSpeech">Hate Speech</option> {/* Corrected value */}
                                <option value="fake">Fake Information</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="flex justify-end gap-4 mt-8">
                                <button 
                                    onClick={() => setShowReportModal(false)}
                                    className="py-2 px-6 rounded-lg font-medium border border-gray-300 transition-all duration-300 text-gray-900"
                                    style={{ backgroundColor: "#42f5ad" }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleReportBlog}
                                    disabled={isReporting || !reportCategory}
                                    className={`py-2 px-6 rounded-lg font-medium transition-all duration-300 text-gray-900 ${
                                        isReporting ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    style={{ backgroundColor: isReporting ? "#a8f8d6" : "#42f5ad" }}
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