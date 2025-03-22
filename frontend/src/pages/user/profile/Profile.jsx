import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Profile</h2>
        <div className="profile-grid">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Full Name:</strong> {user.fullName}</p>
          <p><strong>DOB:</strong> {user.dob}</p>
          <p><strong>NIC:</strong> {user.nic}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Phone:</strong> {user.phoneNumber}</p>
          <p><strong>Interest:</strong> {user.interest}</p>
          <p><strong>Marital Status:</strong> {user.maritalStatus}</p>
        </div>
        <div className="profile-buttons">
          <button className="edit-btn" onClick={() => navigate(`/edit-profile/${id}`)}>Edit Profile</button>
          <button className="delete-btn" onClick={handleDelete}>Delete Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
