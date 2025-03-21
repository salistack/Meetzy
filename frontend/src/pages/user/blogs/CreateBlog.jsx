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
    });

    const [photo, setPhoto] = useState(null);
    const [errors, setErrors] = useState({}); // Store validation errors

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const validateField = (name, value) => {
        let newErrors = { ...errors };

        if (name === "title") {
            if (value.length > 35) {
                newErrors.title = "Title cannot exceed 35 characters.";
            } else if (!/^[A-Za-z\s]+$/.test(value)) {
                newErrors.title = "Title can only contain letters and spaces.";
            } else {
                delete newErrors.title;
            }
        }

        if (name === "authorName") {
            if (!/^[A-Za-z\s]+$/.test(value)) {
                newErrors.authorName = "Author name can only contain letters and spaces.";
            } else {
                delete newErrors.authorName;
            }
        }

        if (name === "category" && !["loneliness", "Health", "Travel", "Education"].includes(value)) {
            newErrors.category = "Please select a valid category.";
        } else {
            delete newErrors.category;
        }

        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation before submission
        if (Object.keys(errors).length > 0 || !formData.title || !formData.authorName) {
            alert("Please correct the errors before submitting.");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("authorName", formData.authorName);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("tags", formData.tags.split(",").map(tag => tag.trim()));

            if (photo) {
                formDataToSend.append("photo", photo);
            }

            const response = await fetch("http://localhost:5000/api/blogs", {
                method: "POST",
                body: formDataToSend,
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
                });
                setPhoto(null);
                setErrors({});
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    placeholder="Title"
                    onChange={handleChange}
                    required
                />
                {errors.title && <p className="error">{errors.title}</p>}

                <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    placeholder="Author Name"
                    onChange={handleChange}
                    required
                />
                {errors.authorName && <p className="error">{errors.authorName}</p>}

                <textarea
                    name="description"
                    value={formData.description}
                    placeholder="Content"
                    onChange={handleChange}
                    required
                ></textarea>

                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="loneliness">Loneliness</option>
                    <option value="Health">Health</option>
                    <option value="Travel">Travel</option>
                    <option value="Education">Education</option>
                </select>
                {errors.category && <p className="error">{errors.category}</p>}

                <input type="file" accept="image/*" onChange={handleFileChange} />

                {photo && (
                    <div>
                        <p>Preview:</p>
                        <img src={URL.createObjectURL(photo)} alt="Preview" width="200px" />
                    </div>
                )}

                <button type="submit">Create Blog</button>
            </form>
        </div>
    );
};

export default CreateBlog;
