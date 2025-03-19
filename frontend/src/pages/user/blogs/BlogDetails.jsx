import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './BlogDetails.css'; // Import the CSS file

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setBlog(data);
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

    if (!blog) return <p>Loading...</p>;

    return (
        <div className="blog-details-container">
            <h2>{blog.title}</h2>
            <p>By {blog.authorName}</p>
            <img src={blog.photo || "https://placehold.co/600"} alt={blog.title} />
            <p className="description">{blog.description}</p>

            <div className="button-group">
                <button onClick={() => navigate(`/user/blogs/edit/${id}`)} className="edit-button">
                    Edit
                </button>
                <button onClick={handleDelete} className="delete-button">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default BlogDetails;
