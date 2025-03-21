import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const CreateGroup = () => {
  const [isLimited, setIsLimited] = useState(false);
  const [numMembers, setNumMembers] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startDateTime: "",
    endDateTime: "",
    description: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  const handleToggle = useCallback(() => {
    setIsLimited((prev) => !prev);
    setNumMembers("");
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key]) formDataToSend.append(key, formData[key]);
      }
      if (isLimited) {
        formDataToSend.append("numMembers", numMembers);
      }

      const response = await fetch("http://localhost:5000/api/groups", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create group.");
      }

      alert("Group Created Successfully!");
      navigate("/user/groups");

      setFormData({
        title: "",
        location: "",
        startDateTime: "",
        endDateTime: "",
        description: "",
        image: null,
      });
      setIsLimited(false);
      setNumMembers("");
      setPreviewImage(null);
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Create Group</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="Enter group title"
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            placeholder="Enter location"
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Start Date & Time:</label>
          <input
            type="datetime-local"
            name="startDateTime"
            value={formData.startDateTime}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium">End Date & Time:</label>
          <input
            type="datetime-local"
            name="endDateTime"
            value={formData.endDateTime}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            placeholder="Enter description"
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {previewImage && (
          <div className="mt-2">
            <label className="block font-medium">Image Preview:</label>
            <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded-md" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="block font-medium">Limited Members:</label>
          <label className="relative inline-flex cursor-pointer">
            <input type="checkbox" checked={isLimited} onChange={handleToggle} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:bg-white after:content-[''] after:absolute after:top-1/2 after:left-1 after:transform after:-translate-y-1/2 after:w-5 after:h-5 after:bg-gray-500 after:rounded-full after:transition"></div>
          </label>
        </div>

        {isLimited && (
          <div>
            <label className="block font-medium">Number of Members:</label>
            <input
              type="number"
              name="numMembers"
              min="1"
              placeholder="Enter max members"
              value={numMembers}
              onChange={(e) => setNumMembers(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        )}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
