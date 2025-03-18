import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import './BlogDetails.css'; // Add this at the top


const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate(); //  Initialize navigation
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
                navigate("/user/blogs"); //  Redirect to the blogs list
            } else {
                alert("Failed to delete blog.");
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    if (!blog) return <p>Loading...</p>;

    return (
        <div>
            <h2>{blog.title}</h2>
            <p>By {blog.authorName}</p>
            <img src={blog.photo || "https://placehold.co/300"} alt={blog.title} />

           
            <p>{blog.description}</p>

            {/* Edit and Delete Buttons */}
            <button 
                onClick={() => navigate(`/user/blogs/edit/${id}`)} 
                className="edit-button"
                style={{ marginRight: "10px", padding: "8px 12px", cursor: "pointer" }}
            >
                Edit
            </button>

            <button 
                onClick={handleDelete} 
                className="delete-button"
                style={{ padding: "8px 12px", cursor: "pointer", backgroundColor: "red", color: "white" }}
            >
                Delete
            </button>
        </div>
    );
};

export default BlogDetails;
