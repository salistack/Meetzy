import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls

const ReportedBlogs = () => {
    const [reportedBlogs, setReportedBlogs] = useState([]); // State to store reported blogs
    const [loading, setLoading] = useState(true); // State to manage loading

    useEffect(() => {
        // Fetch reported blogs from the backend
        const fetchReportedBlogs = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/reportedBlogs");
                setReportedBlogs(response.data); // Set the fetched data
            } catch (error) {
                console.error("Error fetching reported blogs:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchReportedBlogs();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator
    }

    return (
        <div>
            <h1>Reported Blogs</h1>
            {reportedBlogs.length === 0 ? (
                <p>No reported blogs found.</p>
            ) : (
                <ul>
                    {reportedBlogs.map((blog) => (
                        <li key={blog._id}>
                            <p><strong>Blog ID:</strong> {blog.blogId}</p>
                            <p><strong>Reported By:</strong> {blog.reportedBy}</p>
                            <p><strong>Category:</strong> {blog.category}</p>
                            <p><strong>Reported At:</strong> {new Date(blog.reportedAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReportedBlogs;
