import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Blogs.css";  // Import CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/blogs");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    setBlogs(data);
                    setFilteredBlogs(data); // Initialize with all blogs
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

    // Filtering logic
    useEffect(() => {
        let filtered = blogs;

        if (searchQuery) {
            filtered = filtered.filter(blog => 
                blog.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== "All") {
            filtered = filtered.filter(blog => blog.category === selectedCategory);
        }

        setFilteredBlogs(filtered);
    }, [searchQuery, selectedCategory, blogs]);

    if (loading) return <p>Loading blogs...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="blogs-container">
       
          <h2 >MeetZY BlogZ</h2>
        
            {/* Search & Filter Bar */}
            <div className="search-filter-bar">
                <div className="search-box">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by topic..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                </div>

                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="loneliness">Loneliness</option>
                    <option value="Health">Health</option>
                    <option value="Travel">Travel</option>
                    <option value="Education">Education</option>
                </select>

                <button onClick={() => navigate("/user/blogs/create")} className="create-blog-button">
                    Create Blog
                </button>
            </div>

            {/* Blogs List */}
            <div className="blog-grid">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => {
                        const imageUrl = blog.photo ? `http://localhost:5000${blog.photo}` : "https://placehold.co/300";

                        return (
                            <div key={blog._id} className="blog-card">
                                <img 
                                  src={imageUrl} 
                                  alt={blog.title} 
                                  crossOrigin="anonymous"
                                />
                                <h3>{blog.title}</h3>
                                <p>by {blog.authorName || "Unknown"}</p>
                                <Link to={`/user/blogs/${blog._id}`}>Read More</Link>
                            </div>
                        );
                    })
                ) : (
                    <p>No blogs available</p>
                )}
            </div>
        </div>
    );
};

export default Blogs;
