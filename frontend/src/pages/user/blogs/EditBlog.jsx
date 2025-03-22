import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditBlog = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: "", 
        authorName: "",
        description: "",
        content: "",
        category: "Travel",
        tags: "",
        photo: "",
    });

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        title: data.title || "",
                        authorName: data.authorName || "",
                        description: data.description || "",
                        content: data.content || "",
                        category: data.category || "Travel",
                        tags: data.tags ? data.tags.join(", ") : "",
                        photo: data.photo || "",
                    });
                } else {
                    console.error("Failed to fetch blog");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchBlog();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    authorName: formData.authorName,
                    description: formData.description,
                    content: formData.content,
                    category: formData.category,
                    tags: formData.tags.split(",").map(tag => tag.trim()), // Re-format the tags
                    photo: formData.photo,
                }),
            });

            if (response.ok) {
                alert("Blog Updated Successfully!");
            } else {
                alert("Error updating blog");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="edit-blog-container bg-gradient-to-r from-indigo-600 to-purple-600 min-h-screen flex justify-center items-center py-8 px-4">
            <div className="bg-white w-full max-w-lg p-8 rounded-md shadow-xl">
                <h2 className="text-white text-3xl font-bold mb-6">Edit Blog</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="text" 
                            name="authorName" 
                            value={formData.authorName} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <select 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="loneliness">Loneliness</option>
                            <option value="Health">Health</option>
                            <option value="Travel">Travel</option>
                            <option value="Education">Education</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <input 
                            type="text" 
                            name="photo" 
                            value={formData.photo} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            placeholder="Short Description" 
                            onChange={handleChange} 
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-md shadow-md hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 transition duration-300"
                    >
                        Update Blog
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditBlog;
