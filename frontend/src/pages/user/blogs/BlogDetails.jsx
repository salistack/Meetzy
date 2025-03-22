import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './BlogDetails.css'; // Optional if you need custom CSS for specific styles

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportCategory, setReportCategory] = useState("");

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setBlog(data);
                    setAverageRating(data.averageRating); // ✅ Get average rating
                } else {
                    console.error("Failed to fetch blog");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchBlog();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Blog deleted successfully!");
                navigate("/user/blogs");
            } else {
                alert("Failed to delete blog.");
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    const handleRateBlog = async (selectedRating) => {
        try {
            const response = await fetch(`http://localhost:5000/api/blogs/${id}/rate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating: selectedRating }),
            });

            if (response.ok) {
                const data = await response.json();
                setAverageRating(data.averageRating); // ✅ Update average rating
                alert(`Thank you for rating! New Average: ${data.averageRating}`);
            } else {
                alert("Failed to submit rating.");
            }
        } catch (error) {
            console.error("Error rating blog:", error);
        }
    };

    const handleReportBlog = async () => {
        if (!reportCategory) {
            alert("Please select a category to report.");
            return;
        }

        const url = `http://localhost:5000/api/blogs/${id}/report`;
        console.log(`Reporting blog to: ${url}`); // Debugging log

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: reportCategory }),
            });

            if (response.ok) {
                alert("Blog reported successfully!");
                setShowReportModal(false);
                setReportCategory("");
            } else {
                alert("Failed to report the blog.");
            }
        } catch (error) {
            console.error("Error reporting blog:", error);
        }
    };

    // Dark mode toggle function
    const toggleDarkMode = () => {
        const newTheme = darkMode ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    if (!blog) return <p className="text-white">Loading...</p>;

    return (
        <div className={`min-h-screen flex flex-col items-center bg-gradient-to-r ${darkMode ? "from-indigo-600 to-purple-600" : "from-indigo-400 to-pink-400"} p-8`}>
            <button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 transition duration-300"
                onClick={toggleDarkMode}
            >
                {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>

            <h2 className="text-3xl font-bold mt-4 text-white">{blog.title}</h2>
            <p className="mt-2 text-lg text-white">By {blog.authorName}</p>
            <img 
                src={blog.photo ? `http://localhost:5000${blog.photo}` : "https://placehold.co/600"} 
                alt={blog.title} 
                className="mt-4 max-w-full h-auto"
                crossOrigin="anonymous" 
            />
            <p className="mt-6 text-lg text-white">{blog.description}</p>

            <p className="mt-6 text-xl text-white">⭐ Average Rating: {averageRating || "No ratings yet"}</p>

            <div className="mt-4 flex justify-center items-center">
                <p className="mr-4 text-white">Rate this blog:</p>
                {[1, 2, 3, 4, 5].map((num) => (
                    <span 
                        key={num} 
                        className={`cursor-pointer text-2xl ${rating >= num ? "text-yellow-400" : "text-gray-400"}`}
                        onClick={() => { 
                            setRating(num);
                            handleRateBlog(num);
                        }}
                    >
                        ⭐
                    </span>
                ))}
            </div>

            <div className="mt-8 flex gap-4">
                <button onClick={() => navigate(`/user/blogs/edit/${id}`)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                    Edit
                </button>
                <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300">
                    Delete
                </button>
                <button onClick={() => setShowReportModal(true)} className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300">
                    Report
                </button>
            </div>

            {showReportModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-80">
                        <h3 className="text-xl font-bold mb-4 text-black">Report Blog</h3>
                        <p className="text-black">Select a category:</p>
                        <select
                            value={reportCategory}
                            onChange={(e) => setReportCategory(e.target.value)}
                            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        >
                            <option value="">--Select--</option>
                            <option value="sex">Sex</option>
                            <option value="terrorism">Terrorism</option>
                            <option value="abuse">Abuse</option>
                            <option value="hateSpeech">Hate Speech</option>
                            <option value="fake">Fake</option>
                            <option value="other">Other</option>
                        </select>
                        <div className="mt-4 flex gap-4">
                            <button onClick={handleReportBlog} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                                Submit
                            </button>
                            <button onClick={() => setShowReportModal(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogDetails;
