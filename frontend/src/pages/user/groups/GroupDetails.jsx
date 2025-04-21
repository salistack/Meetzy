import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import "./GroupDetails.css"; 

const GroupDetails = () => {
  const { id } = useParams(); 
  const [group, setGroup] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // Track if the user is connected
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${id}`);
        if (response.ok) {
          const groupData = await response.json();
          setGroup(groupData);
          setIsConnected(groupData.isUserConnected); // Assuming backend provides this info
        } else {
          alert("Failed to fetch group details.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchGroupDetails(); 
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Group deleted successfully");
          navigate("/user/groups"); 
        } else {
          alert("Failed to delete the group.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleUpdate = () => {
    navigate(`/user/groups/update/${id}`); 
  };

  const handleConnect = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${id}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 123 }), // Replace with actual user ID
      });

      if (response.ok) {
        alert("Successfully connected to the group!");
        setIsConnected(true);
      } else {
        alert("Failed to connect. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!group) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="group-details-container">
      <h2>{group.title}</h2>
      <p><strong>Location:</strong> {group.location}</p>
      <p><strong>Description:</strong> {group.description}</p>
      <p><strong>Start Date & Time:</strong> {new Date(group.startDateTime).toLocaleString()}</p>
      <p><strong>End Date & Time:</strong> {new Date(group.endDateTime).toLocaleString()}</p>
      {group.numMembers && <p><strong>Max Members:</strong> {group.numMembers}</p>}
      
      {group.image && (
        <img
          src={`http://localhost:5000${group.image}`}
          alt="Group"
          className="group-image"
        />
      )}
      
      <div className={`group-actions ${group.image ? '' : 'no-image'}`}>
        <button onClick={handleUpdate} className="update-btn">Update</button>
        <button onClick={handleDelete} className="delete-btn">Delete</button>
        <button 
          onClick={handleConnect} 
          className="connect-btn" 
          disabled={isConnected} // Disable button if already connected
        >
          {isConnected ? "Connected" : "Connect"}
        </button>
      </div>
    </div>
  );
};

export default GroupDetails;
