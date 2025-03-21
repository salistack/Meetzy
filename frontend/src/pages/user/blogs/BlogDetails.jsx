import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './BlogDetails.css'; // Import the CSS file

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(null);

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

    // Dark mode toggle function
    const toggleDarkMode = () => {
        const newTheme = darkMode ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    if (!blog) return <p>Loading...</p>;

    return (
        <div className="blog-details-container">
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>

            <h2>{blog.title}</h2>
            <p>By {blog.authorName}</p>
            <img 
                src={blog.photo ? `http://localhost:5000${blog.photo}` : "https://placehold.co/600"} 
                alt={blog.title} 
                crossOrigin="anonymous" 
            />
            <p className="description">{blog.description}</p>

            {/* ✅ Display Average Rating */}
            <p className="rating">⭐ Average Rating: {averageRating || "No ratings yet"}</p>

            {/* ✅ Rating Selection */}
            <div className="rating-section">
                <p>Rate this blog:</p>
                {[1, 2, 3, 4, 5].map((num) => (
                    <span 
                        key={num} 
                        className={`star ${rating >= num ? "selected" : ""}`}
                        onClick={() => { 
                            setRating(num);
                            handleRateBlog(num);
                        }}
                    >
                        ⭐
                    </span>
                ))}
            </div>

            <div className="button-group">
                <button onClick={() => navigate(`/user/blogs/edit/${id}`)} className="edit-button">
                    Edit
                </button>
                <button onClick={handleDelete} className="delete-button">
                    Delete
                </button>

                <button onClick={() => alert("Blog reported successfully!")} className="report-button">
                  Report
               </button>
            </div>
        </div>
    );
};

export default BlogDetails;
