import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setEditedUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        editedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data.user);
      setMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete your account?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      alert("Account deleted successfully.");
      navigate("/"); // Redirect to App.jsx route
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-4 text-white">Loading profile...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 text-white py-10">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-lg text-center">
        <h2 className="text-3xl font-semibold mb-6">User Profile</h2>

        {message && <p className="text-green-300 mb-4">{message}</p>}

        <div className="space-y-4 text-left">
          {[
            { label: "Name", key: "fullName" },
            { label: "Email", key: "email" },
            { label: "Date of Birth", key: "dob" },
            { label: "Phone", key: "phoneNumber" },
            { label: "Address", key: "address" },
            { label: "Website", key: "website" },
            { label: "Additional Info", key: "allInfo" },
          ].map(({ label, key }) => (
            <div key={key}>
              <p className="text-lg font-medium">
                {label}:{" "}
                {isEditing ? (
                  <input
                    name={key}
                    value={editedUser[key] || ""}
                    onChange={handleChange}
                    className="ml-2 px-2 py-1 bg-white/70 text-black rounded"
                  />
                ) : (
                  <span className="text-gray-300">{user[key] || "N/A"}</span>
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 items-center">
          {isEditing ? (
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedUser(user);
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
