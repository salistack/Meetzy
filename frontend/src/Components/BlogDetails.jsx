import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetails = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!blog) {
    return <p className="text-center text-gray-600">Blog not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{blog.title}</h1>
      <p className="text-gray-700 mb-6">{blog.description}</p>
      {blog.photo && (
        <img
          src={`http://localhost:5000${blog.photo}`}
          alt={blog.title}
          className="w-full h-auto rounded"
        />
      )}
      <p className="text-sm text-gray-600 mt-4">
        <span className="font-semibold">Category:</span> {blog.category}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Author:</span> {blog.author?.name || "Unknown"}
      </p>
    </div>
  );
};

export default BlogDetails;
