import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        <div className="blogs-container min-h-screen w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex flex-col justify-start items-center">
            <h2 className="text-2xl font-bold mb-8 text-white">MeetZY BlogZ</h2>
        
            {/* Search & Filter Bar */}
            <div className="search-filter-bar flex justify-between items-center mb-8 space-x-6 w-full max-w-6xl px-6">
                <div className="search-box relative w-72">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                    <input 
                        type="text" 
                        placeholder="Search by topic..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="w-full py-2 pl-10 pr-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="py-2 px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All Categories</option>
                    <option value="loneliness">Loneliness</option>
                    <option value="Health">Health</option>
                    <option value="Travel">Travel</option>
                    <option value="Education">Education</option>
                </select>

                <button 
                    onClick={() => navigate("/user/blogs/create")} 
                    className="py-2 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Create Blog
                </button>
            </div>

            {/* Blogs List */}
            <div className="blog-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl px-6">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => {
                        const imageUrl = blog.photo ? `http://localhost:5000${blog.photo}` : "https://placehold.co/300";

                        return (
                            <div key={blog._id} className="blog-card bg-white p-6 rounded-lg border border-gray-200 shadow-lg transition transform hover:translate-y-2">
                                <img 
                                  src={imageUrl} 
                                  alt={blog.title} 
                                  className="w-full h-48 object-cover rounded-lg mb-4"
                                  crossOrigin="anonymous"
                                />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h3>
                                <p className="text-sm text-gray-600">by {blog.authorName || "Unknown"}</p>
                                <Link 
                                    to={`/user/blogs/${blog._id}`} 
                                    className="mt-4 inline-block py-2 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Read More
                                </Link>
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
