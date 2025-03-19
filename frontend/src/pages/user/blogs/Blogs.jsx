import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Blogs.css"; // Import CSS

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/blogs");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched data:", data);

                if (Array.isArray(data)) {
                    setBlogs(data);
                } else {
                    setError("API response is not in the expected format");
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) return <p>Loading blogs...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="blogs-container">
            <h2>All Blogs</h2>

            <button onClick={() => navigate("/user/blogs/create")} className="create-blog-button">
                Create Blog
            </button>

            <div className="blog-grid">
                {blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <div key={blog._id} className="blog-card">
                            <img src={blog.photo || "https://placehold.co/300"} alt={blog.title} />
                            <h3>{blog.title}</h3>
                            <p>by {blog.authorName || "Unknown"}</p>
                            <Link to={`/user/blogs/${blog._id}`}>Read More</Link>
                        </div>
                    ))
                ) : (
                    <p>No blogs available</p>
                )}
            </div>
        </div>
    );
};

export default Blogs;
