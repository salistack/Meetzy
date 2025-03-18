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
        <div>
            <h2>Edit Blog</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={formData.title} disabled />
                <input type="text" name="authorName" value={formData.authorName} disabled />
                <select name="category" value={formData.category} disabled>
                    <option value="loneliness">Loneliness</option>
                    <option value="Health">Health</option>
                    <option value="Travel">Travel</option>
                    <option value="Education">Education</option>
                </select>

                <input type="text" name="photo" value={formData.photo} disabled />

                {/* Editable fields */}
                <textarea name="description" value={formData.description} placeholder="Short Description" onChange={handleChange} required></textarea>
              

                <button type="submit">Update Blog</button>
            </form>
        </div>
    );
};

export default EditBlog;
