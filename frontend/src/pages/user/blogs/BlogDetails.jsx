import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../Components/Header";

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
        blogId: id,
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
    document.documentElement.style.setProperty('--primary-color', '#3b82f6');
    document.documentElement.style.setProperty('--primary-hover', '#2563eb');
  }, [darkMode]);

  if (!blog) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"} transition-colors duration-500`}>
      {/* Header Component */}
      <Header />
      
      <div className="flex flex-col items-center p-4 md:p-8 flex-grow">
        {/* Dark Mode Toggle */}
        <div className="w-full max-w-4xl flex justify-end mb-6">
          <button
            onClick={toggleDarkMode}
            className={`py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
              darkMode 
                ? "bg-blue-500 hover:bg-blue-600 text-white" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Blog Content - Main Container */}
        <div className={`w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
          {/* Blog Header with Enhanced Styling */}
          <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
            {/* Blog Category & Date */}
            <div className="flex items-center mb-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 font-medium">
                Blog
              </span>
              {blog.createdAt && (
                <span className="ml-3 text-gray-500 dark:text-gray-400">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
            
            {/* Blog Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{blog.title}</h1>
            
            {/* Author Info */}
            <div className="flex items-center">
              {blog.author?.avatar ? (
                <img 
                  src={`http://localhost:5000${blog.author.avatar}`} 
                  alt={blog.author?.name} 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-10 h-10 rounded-full mr-3 bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                  {blog.author?.name?.charAt(0) || "A"}
                </div>
              )}
              <div>
                <p className="font-medium">By {blog.author?.name || 'Unknown Author'}</p>
                {blog.author?.role && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{blog.author.role}</p>
                )}
              </div>
            </div>
          </div>

          {/* Blog Image with Enhanced Presentation */}
          {blog.photo && (
            <div className="relative w-full h-72 md:h-96 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
              <img 
                src={`http://localhost:5000${blog.photo}`} 
                alt={blog.title} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                crossOrigin="anonymous"
              />
            </div>
          )}

          {/* Blog Description with Better Typography */}
          <div className="p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {blog.description}
              </p>
            </div>
          </div>

          {/* Social Share Section */}
          <div className={`p-6 md:p-8 border-t border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex items-center flex-wrap gap-4">
              <span className="font-medium">Share this article:</span>
              <div className="flex space-x-3">
                <button className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </button>
                <button className="p-2 rounded-full bg-blue-400 hover:bg-blue-500 text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </button>
                <button className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.08.66-.23.66-.5v-1.7C6.73 19.91 6.14 18 6.14 18A2.69 2.69 0 0 0 5 16.5c-.91-.62.07-.6.07-.6a2.1 2.1 0 0 1 1.53 1 2.15 2.15 0 0 0 2.91.83 2.16 2.16 0 0 1 .63-1.34c-2.22-.25-4.55-1.11-4.55-4.92a3.86 3.86 0 0 1 1-2.69 3.58 3.58 0 0 1 .1-2.64s.84-.27 2.75 1a9.63 9.63 0 0 1 5 0c1.91-1.29 2.75-1 2.75-1a3.58 3.58 0 0 1 .1 2.64 3.86 3.86 0 0 1 1 2.69c0 3.82-2.34 4.66-4.57 4.91a2.39 2.39 0 0 1 .69 1.85V21c0 .27.16.59.67.5A10 10 0 0 0 12 2z"></path>
                  </svg>
                </button>
                <button className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Rating Section with Enhanced Design */}
          <div className={`p-6 md:p-8 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Reader Ratings</h3>
                {averageRating ? (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500 text-2xl">⭐</span> 
                    <span className="font-medium">Average Rating: {typeof averageRating === 'number' ? averageRating.toFixed(1) : averageRating} / 5</span>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No ratings yet</p>
                )}
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-600" : "bg-blue-50"}`}>
                <p className="font-medium mb-2">Rate this blog:</p>
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
                        <span className="text-yellow-400">★</span>
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
            <div className="p-6 md:p-8 flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => navigate(`/blogs/edit/${id}`)}
                className="py-3 px-8 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 text-white bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Blog
              </button>
              <button 
                onClick={handleDelete}
                className="py-3 px-8 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 text-white bg-red-500 hover:bg-red-600 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete Blog
              </button>
            </div>
          )}

          {/* Report Button with Better Design */}
          <div className="p-6 flex justify-center">
            <button 
              onClick={() => setShowReportModal(true)}
              className="py-2 px-6 rounded-full font-medium transition-all duration-300 flex items-center gap-2 border border-gray-300 bg-transparent hover:bg-red-50 text-red-500 hover:text-red-600 hover:border-red-200 dark:hover:bg-gray-700 dark:border-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Report this blog
            </button>
          </div>
        </div>

        {/* Report Modal with Improved Design */}
        {showReportModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-sm transition-opacity duration-300">
            <div 
              className={`w-full max-w-md rounded-xl shadow-2xl transform transition-all duration-300 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    Report Blog
                  </h3>
                  <button 
                    onClick={() => setShowReportModal(false)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
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
                    borderColor: "#3b82f6", 
                    "--tw-ring-color": "#3b82f6"
                  }}
                >
                  <option value="">-- Select a reason --</option>
                  <option value="sex">Sexual Content</option>
                  <option value="terrorism">Terrorism</option>
                  <option value="abuse">Abuse</option>
                  <option value="hateSpeech">Hate Speech</option>
                  <option value="fake">Fake Information</option>
                  <option value="other">Other</option>
                </select>
                <div className="flex justify-end gap-4 mt-8">
                  <button 
                    onClick={() => setShowReportModal(false)}
                    className="py-2 px-6 rounded-lg font-medium border border-gray-300 transition-all duration-300 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReportBlog}
                    disabled={isReporting || !reportCategory}
                    className={`py-2 px-6 rounded-lg font-medium transition-all duration-300 text-white ${
                      isReporting || !reportCategory ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
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
    </div>
  );
};

export default BlogDetails;