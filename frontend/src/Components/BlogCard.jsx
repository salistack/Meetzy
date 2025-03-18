// src/Components/BlogCard.jsx
import { Link } from "react-router-dom";
import "./BlogCard.css"; // Optional, for styling
import './BlogCard.css'; // Import the CSS file


const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card">
      <h2 className="blog-title">{blog.title}</h2>
      <p className="blog-author">By {blog.authorName}</p>
      <Link to={`/user/blogs/${blog._id}`} className="read-more">Read More</Link>
    </div>
  );
};

export default BlogCard;

