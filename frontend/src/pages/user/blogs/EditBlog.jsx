import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Travel",
        photo: null,
        existingPhoto: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                
                setFormData({
                    title: response.data.title,
                    description: response.data.description,
                    category: response.data.category,
                    existingPhoto: response.data.photo || ""
                });
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch blog", error);
                setError("Failed to load blog data");
                setIsLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const token = localStorage.getItem("token");
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("category", formData.category);
            
            // Only append photo if a new one was selected
            if (formData.photo) {
                formDataToSend.append("photo", formData.photo);
            } else if (formData.existingPhoto) {
                formDataToSend.append("photo", formData.existingPhoto);
            }

            const response = await axios.put(
                `http://localhost:5000/api/blogs/${id}`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                alert("Blog updated successfully!");
                navigate(`/blogs/${id}`);
            }
        } catch (error) {
            console.error("Error updating blog:", error);
            if (error.response?.status === 403) {
                alert("You are not authorized to update this blog");
            } else {
                alert("Failed to update blog. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Blog</h2>
                
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="5"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="loneliness">Loneliness</option>
                            <option value="Health">Health</option>
                            <option value="Travel">Travel</option>
                            <option value="Education">Education</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Blog Image</label>
                        {formData.existingPhoto && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">Current Image:</p>
                                <img 
                                    src={`http://localhost:5000${formData.existingPhoto}`} 
                                    alt="Current blog" 
                                    className="w-40 h-auto rounded-md"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave blank to keep current image</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Updating..." : "Update Blog"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditBlog;