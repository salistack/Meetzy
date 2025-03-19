import { useState } from "react";
import "./CreateBlog.css";  // Import CSS

const CreateBlog = () => {
    const [formData, setFormData] = useState({
        title: "",
        authorName: "",
        description: "",
        content: "",
        category: "Travel",
        tags: "",
        photo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ...formData, 
                    tags: formData.tags.split(",").map(tag => tag.trim()) 
                }),
            });

            if (response.ok) {
                alert("Blog Created Successfully!");
                setFormData({
                    title: "",
                    authorName: "",
                    description: "",
                    content: "",
                    category: "Travel",
                    tags: "",
                    photo: "",
                });
            } else {
                alert("Error creating blog");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="create-blog-container">
            <h2>Create a New Blog</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={formData.title} placeholder="Title" onChange={handleChange} required />
                <input type="text" name="authorName" value={formData.authorName} placeholder="Author Name" onChange={handleChange} required />
                <textarea name="description" value={formData.description} placeholder="Conetent" onChange={handleChange} required></textarea>    
                <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="loneliness">Loneliness</option>
                    <option value="Health">Health</option>
                    <option value="Travel">Travel</option>
                    <option value="Education">Education</option>
                </select>
                <input type="text" name="photo" value={formData.photo} placeholder="Image URL" onChange={handleChange} />
                <button type="submit">Create Blog</button>
            </form>
        </div>
    );
};

export default CreateBlog;
