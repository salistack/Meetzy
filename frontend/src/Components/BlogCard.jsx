import { Link } from "react-router-dom";
import "./BlogCard.css"; // Optional, for styling

const BlogCard = ({ blog }) => {
    // Ensure image URL is correct
    const imageUrl = blog.photo ? `http://localhost:5000${blog.photo}` : "https://placehold.co/300";

    return (
        <div className="blog-card">
            <img src={imageUrl} alt={blog.title} className="blog-image" />
            <h3 className="blog-title">{blog.title}</h3>
            <p className="blog-author">By {blog.authorName || "Unknown"}</p>
            <Link to={`/user/blogs/${blog._id}`} className="read-more">
                Read More
            </Link>
        </div>
    );
};

export default BlogCard;
