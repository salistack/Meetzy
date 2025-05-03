import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../Components/Header";

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
                    setFilteredBlogs(data);
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

    if (loading) return <div className="text-center text-gray-800 font-bold text-xl p-5">Loading blogs...</div>;
    if (error) return <div className="text-center text-red-600 font-bold text-xl p-5">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-[#f3f6f5]">
            {/* Add Header component */}
            <Header />
            
            <div className="w-full flex flex-col justify-start items-center py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-10 tracking-wide">MeetZY BlogZ</h2>

                {/* Search & Filter Bar */}
                <div className="search-filter-bar flex flex-col md:flex-row justify-between items-center mb-12 w-full max-w-6xl space-y-6 md:space-y-0 px-3">
                    <div className="search-box relative w-full md:w-96">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by topic..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-3 pl-12 pr-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
                        />
                    </div>

                    <div className="filter-box relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="py-3 px-6 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
                        >
                            <option value="All">All Categories</option>
                            <option value="loneliness">Loneliness</option>
                            <option value="Health">Health</option>
                            <option value="Travel">Travel</option>
                            <option value="Education">Education</option>
                        </select>
                    </div>

                    <button
                        onClick={() => navigate("/user/blogs/create")}
                        className="py-3 px-8 bg-blue-500 hover:bg-blue-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all shadow-md"
                    >
                        Create Blog
                    </button>
                </div>

                {/* Blogs List */}
                <div className="blog-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl px-3">
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map((blog) => {
                            const imageUrl = blog.photo ? `http://localhost:5000${blog.photo}` : "https://placehold.co/400";

                            return (
                                <div
                                    key={blog._id}
                                    className="blog-card relative bg-white p-6 rounded-2xl border border-gray-200 shadow hover:shadow-lg transition-transform hover:scale-[1.02] ease-in-out duration-300"
                                >
                                    <img
                                        src={imageUrl}
                                        alt={blog.title}
                                        className="w-full h-56 object-cover rounded-xl mb-4 shadow-sm transition-transform duration-300 transform hover:scale-105"
                                        crossOrigin="anonymous"
                                    />

                                    {/* Category Badge */}
                                    <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                        {blog.category}
                                    </span>

                                    <h3 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-2">{blog.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">by {blog.authorName || "Unknown"}</p>

                                    <div className="flex justify-between items-center">
                                        <Link
                                            to={`/user/blogs/${blog._id}`}
                                            className="py-2 px-5 text-sm bg-blue-500 hover:bg-blue-400 text-white rounded-xl transition-all shadow"
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center text-gray-600 text-xl">No blogs available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blogs;