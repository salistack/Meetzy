import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
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
  const [error, setError] = useState(null);
  const [imageSizeError, setImageSizeError] = useState(null);

  const fileInputRef = useRef(null);
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
        fileInputRef.current.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setImageSizeError("File size should not exceed 2MB.");
        fileInputRef.current.value = '';
        return;
      }

      setImageSizeError(null);
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageCancel = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreviewImage(null);
    setImageSizeError(null);
    fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLimited && !numMembers) {
      setError("Please specify the number of members.");
      return;
    }

    const currentDateTime = new Date();
    const startDateTime = new Date(formData.startDateTime);
    if (startDateTime <= currentDateTime) {
      setError("Start date and time must be after the current time.");
      return;
    }

    const endDateTime = new Date(formData.endDateTime);
    if (endDateTime <= startDateTime) {
      setError("End date and time must be after the start date and time.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found. Please login again.");
        return;
      }

      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key]) formDataToSend.append(key, formData[key]);
      }
      if (isLimited) {
        formDataToSend.append("numMembers", numMembers);
      }

      const response = await fetch("http://localhost:5000/api/groups", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Fixed syntax error
        },
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create group.");
      }

      alert("Group Created Successfully!");
      navigate("/user/groups");

      // Reset form state
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
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
      <Header />
      
      <div className="pt-20 pb-8 px-4"> {/* Adjusted padding to account for header */}
        <div className="max-w-2xl w-full p-6 rounded-lg shadow-xl bg-white/30 backdrop-blur-lg mx-auto">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">Create Group</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {imageSizeError && <p className="text-red-500 text-center mb-4">{imageSizeError}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700">Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                placeholder="Enter group title"
                onChange={handleChange}
                className="w-full p-3 bg-transparent border border-white/50 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                placeholder="Enter location"
                onChange={handleChange}
                className="w-full p-3 bg-transparent border border-white/50 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Start Date & Time:</label>
              <input
                type="datetime-local"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleChange}
                className="w-full p-3 bg-transparent border border-white/50 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">End Date & Time:</label>
              <input
                type="datetime-local"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleChange}
                className="w-full p-3 bg-transparent border border-white/50 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                placeholder="Enter description"
                onChange={handleChange}
                className="w-full p-3 bg-transparent border border-white/50 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Image:</label>
              <div className="flex items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 bg-transparent border border-white/50 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="button"
                  onClick={handleImageCancel}
                  className="ml-4 text-red-500"
                >
                  Cancel
                </button>
              </div>
              <p className="text-sm text-white mt-1">Maximum file size: 2MB</p>
            </div>

            {previewImage && (
              <div className="mt-2">
                <label className="block font-medium text-gray-700">Image Preview:</label>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-48 h-48 object-cover mt-2 rounded-md"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="block font-medium text-gray-700">Limited Members:</label>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" checked={isLimited} onChange={handleToggle} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-yellow-400 peer-checked:after:translate-x-full peer-checked:after:bg-white after:content-[''] after:absolute after:top-1/2 after:left-1 after:transform after:-translate-y-1/2 after:w-5 after:h-5 after:bg-gray-500 after:rounded-full after:transition"></div>
              </label>
            </div>

            {isLimited && (
              <div>
                <label className="block font-medium text-gray-700">Number of Members:</label>
                <input
                  type="number"
                  name="numMembers"
                  min="1"
                  placeholder="Enter max members"
                  value={numMembers}
                  onChange={(e) => setNumMembers(e.target.value)}
                  className="w-full p-3 bg-transparent border border-white/50 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg shadow-lg hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
            >
              Create Group
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;