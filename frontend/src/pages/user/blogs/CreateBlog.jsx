import { useState } from "react";
import "./CreateBlog.css";  // Import your custom CSS if you need

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">Create a New Blog</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="Title"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          {/* Author Name Field */}
          <div className="space-y-2">
            <input
              type="text"
              name="authorName"
              value={formData.authorName}
              placeholder="Author Name"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
            {errors.authorName && <p className="text-red-500 text-sm">{errors.authorName}</p>}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <textarea
              name="description"
              value={formData.description}
              placeholder="Description"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            ></textarea>
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            >
              <option value="loneliness">Loneliness</option>
              <option value="Health">Health</option>
              <option value="Travel">Travel</option>
              <option value="Education">Education</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
          </div>

          {/* File Upload Field */}
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-white bg-transparent border border-white/50 rounded-lg"
            />
            {photo && (
              <div className="mt-2">
                <p className="text-white">Preview:</p>
                <img src={URL.createObjectURL(photo)} alt="Preview" className="w-40 h-auto mt-2 rounded-md" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all"
          >
            Create Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
