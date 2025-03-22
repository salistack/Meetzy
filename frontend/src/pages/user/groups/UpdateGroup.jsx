import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css";  // Assuming your CSS file

const UpdateGroup = () => {
  const [isLimited, setIsLimited] = useState(false);
  const [numMembers, setNumMembers] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startDateTime: "",
    endDateTime: "",
    description: "",
    image: null,
    imageUrl: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const [imageSizeError, setImageSizeError] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            title: data.title,
            location: data.location,
            startDateTime: new Date(data.startDateTime).toISOString().slice(0, 16),
            endDateTime: new Date(data.endDateTime).toISOString().slice(0, 16),
            description: data.description,
            image: null,
            imageUrl: data.image || "",
          });
          setIsLimited(data.isLimited);
          setNumMembers(data.numMembers || "");
          if (data.image) {
            setPreviewImage(`http://localhost:5000${data.image}`);
          }
        } else {
          alert("Failed to fetch group details.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchGroupDetails();
  }, [id]);

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
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        fileInputRef.current.value = ''; // Reset file input value
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB
        setImageSizeError("File size should not exceed 2MB.");
        fileInputRef.current.value = ''; // Reset file input value
        return;
      }

      setImageSizeError(null); // Clear previous error
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageCancel = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreviewImage(null);
    setImageSizeError(null); // Clear image size error
    fileInputRef.current.value = ''; // Reset file input value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the number of members if "Limited Members" is checked
    if (isLimited && !numMembers) {
      setError("Please specify the number of members.");
      return;
    }

    // Get the current date and time
    const now = new Date();

    // Convert formData.startDateTime and formData.endDateTime to Date objects
    const startDateTime = new Date(formData.startDateTime);
    const endDateTime = new Date(formData.endDateTime);

    // Validate startDateTime
    if (startDateTime <= now) {
      setError("Start date and time must be after the current time.");
      return;
    }

    // Validate endDateTime
    if (endDateTime <= startDateTime) {
      setError("End date and time must be after the start date and time.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key !== "imageUrl") {
          if (key === "image" && !formData.image) {
            formDataToSend.append("image", formData.imageUrl);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      }
      if (isLimited) {
        formDataToSend.append("numMembers", numMembers);
      }

      const response = await fetch(`http://localhost:5000/api/groups/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Group Updated Successfully!");
        navigate("/user/groups");
      } else {
        alert("Failed to update group.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message); // Set the error message for display
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">Update Group</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {imageSizeError && <p className="text-red-500 text-center mb-4">{imageSizeError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="text-white">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Location Field */}
          <div className="space-y-2">
            <label className="text-white">Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Start Date Time Field */}
          <div className="space-y-2">
            <label className="text-white">Start Date & Time:</label>
            <input
              type="datetime-local"
              name="startDateTime"
              value={formData.startDateTime}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* End Date Time Field */}
          <div className="space-y-2">
            <label className="text-white">End Date & Time:</label>
            <input
              type="datetime-local"
              name="endDateTime"
              value={formData.endDateTime}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="text-white">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            ></textarea>
          </div>

          {/* File Upload Field */}
          <div className="space-y-2">
            <label className="text-white">Group Image:</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full text-white bg-transparent border border-white/50 rounded-lg"
            />
            {previewImage && (
              <div className="mt-2">
                <p className="text-white">Preview:</p>
                <img src={previewImage} alt="Preview" className="w-40 h-auto mt-2 rounded-md" />
                <button onClick={handleImageCancel} className="mt-2 text-red-500">Cancel Image</button>
              </div>
            )}
          </div>

          {/* Limited Members Toggle */}
          <div className="space-y-2">
            <label className="text-white">
              <input
                type="checkbox"
                checked={isLimited}
                onChange={handleToggle}
                className="mr-2"
              />
              Limited Members
            </label>
            {isLimited && (
              <div className="space-y-2">
                <label className="text-white">Number of Members:</label>
                <input
                  type="number"
                  name="numMembers"
                  value={numMembers}
                  onChange={(e) => setNumMembers(e.target.value)}
                  className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg focus:ring-2 focus:ring-yellow-400"
            >
              Update Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateGroup;
