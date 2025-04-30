import { useState } from "react";

const CreateFeed = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    feeling: "",
    location: "",
  });

  const [errors, setErrors] = useState({}); // Store validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    if (name === "title") {
      if (value.length > 35) {
        newErrors.title = "Title cannot exceed 35 characters.";
      } else if (!/^[A-Za-z0-9\s]+$/.test(value)) {
        newErrors.title = "Title can only contain letters, numbers, and spaces.";
      } else {
        delete newErrors.title;
      }
    }

    if (name === "location") {
      if (!/^[A-Za-z0-9\s,]+$/.test(value)) {
        newErrors.location = "Location can only contain letters, numbers, and commas.";
      } else {
        delete newErrors.location;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    if (Object.keys(errors).length > 0 || !formData.title || !formData.content) {
      alert("Please correct the errors before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/feeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Feed Created Successfully!");
        setFormData({
          title: "",
          content: "",
          feeling: "",
          location: "",
        });
        setErrors({});
      } else {
        alert("Error creating feed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">Create a New Feed</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Content Field */}
          <div className="space-y-2">
            <textarea
              name="content"
              value={formData.content}
              placeholder="Content"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            ></textarea>
          </div>

          {/* Feeling Field */}
          <div className="space-y-2">
            <select
              name="feeling"
              value={formData.feeling}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Feeling</option>
              <option value="happy">Happy</option>
              <option value="sad">Sad</option>
              <option value="excited">Excited</option>
              <option value="angry">Angry</option>
            </select>
          </div>

          {/* Location Field */}
          <div className="space-y-2">
            <input
              type="text"
              name="location"
              value={formData.location}
              placeholder="Location"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all"
          >
            Create Feed
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFeed;
