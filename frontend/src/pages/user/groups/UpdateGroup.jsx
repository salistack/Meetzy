import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css";

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

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/groups/${id}`, { // Fixed URL syntax
          headers: {
            Authorization: `Bearer ${token}`, // Fixed syntax error
          },
        });
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
        } else {
          alert("Failed to fetch group details.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchGroupDetails();
  }, [id]);

  const handleToggle = () => {
    setIsLimited(!isLimited);
    if (!isLimited) setNumMembers("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, image: files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      
      // Append all form data except imageUrl
      formDataToSend.append("title", formData.title);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("startDateTime", formData.startDateTime);
      formDataToSend.append("endDateTime", formData.endDateTime);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("isLimited", isLimited);
      
      if (isLimited) {
        formDataToSend.append("numMembers", numMembers);
      }
      
      // Only append image if a new one was selected
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(`http://localhost:5000/api/groups/${id}`, { // Fixed URL syntax
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Fixed syntax error
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Group Updated Successfully!");
        navigate("/user/groups");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update group.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while updating the group.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Update Group</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
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

        {formData.imageUrl && (
          <div className="mt-2">
            <label className="block font-medium">Current Image:</label>
            <img
              src={`http://localhost:5000${formData.imageUrl}`} // Fixed URL syntax
              alt="Group"
              className="w-32 h-32 object-cover mt-2 rounded-md"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="block font-medium">Limited Members:</label>
          <label className="relative inline-flex cursor-pointer">
            <input 
              type="checkbox" 
              checked={isLimited} 
              onChange={handleToggle} 
              className="sr-only peer" 
            />
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
              value={numMembers}
              onChange={(e) => setNumMembers(e.target.value)}
              className="w-full p-2 border rounded-md"
              required={isLimited}
            />
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Update Group
        </button>
      </form>
    </div>
  );
};

export default UpdateGroup;