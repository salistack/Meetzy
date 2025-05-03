import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./GroupDetails.css";
import Header from "../../../components/Header.jsx";

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGroupDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch group details");
        }

        const groupData = await response.json();
        setGroup(groupData);

        const decoded = jwtDecode(token);
        const userId = decoded._id || decoded.id;

        const isMember = groupData.members.some(member => 
          (member._id === userId) || (member === userId)
        );
        setIsConnected(isMember);

        const adminId = groupData.groupAdmin._id;
        setIsAdmin(userId === adminId);

      } catch (error) {
        console.error("Error:", error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchGroupDetails();
    } else {
      alert("Please login to view group details.");
      navigate("/login", { state: { from: `/groups/${id}` } });
    }
  }, [id, token, navigate]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/groups/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the group");
      }
      
      alert("Group deleted successfully");
      navigate("/user/groups");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  const handleUpdate = () => {
    const confirmUpdate = window.confirm("Are you sure you want to update this group?");
    if (confirmUpdate) {
      navigate(`/user/groups/update/${id}`);
    }
  };

  const handleConnect = async () => {
    const confirmJoin = window.confirm("Are you sure you want to join this group?");
    if (!confirmJoin) return;

    try {
      const response = await fetch(`http://localhost:5000/api/groups/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the group");
      }

      const updatedGroup = { ...group };
      const decoded = jwtDecode(token);
      const userId = decoded._id || decoded.id;
      
      updatedGroup.members = [...(updatedGroup.members || []), userId];
      setGroup(updatedGroup);
      setIsConnected(true);
      
      alert("Successfully connected to the group!");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  const handleLeave = async () => {
    const confirmLeave = window.confirm("Are you sure you want to leave this group?");
    if (!confirmLeave) return;

    try {
      const response = await fetch(`http://localhost:5000/api/groups/${id}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to leave the group");
      }

      const decoded = jwtDecode(token);
      const userId = decoded._id || decoded.id;
      
      const updatedGroup = { ...group };
      updatedGroup.members = updatedGroup.members.filter(member => 
        (member._id !== userId) && (member !== userId)
      );
      
      setGroup(updatedGroup);
      setIsConnected(false);
      
      alert("You have left the group.");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <Header />
        <div className="loading-container">
          <p>Loading group details...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="page-container">
        <Header />
        <div className="error-container">
          <p>Failed to load group details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
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
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300";
            }}
          />
        )}

        <div className={`group-actions ${group.image ? '' : 'no-image'}`}>
          {isAdmin && (
            <>
              <button onClick={handleUpdate} className="update-btn">Update</button>
              <button onClick={handleDelete} className="delete-btn">Delete</button>
            </>
          )}

          {isConnected ? (
            <>
              <button onClick={handleLeave} className="leave-btn">Leave</button>
              <button 
                onClick={() => {
                  const confirmChat = window.confirm("Are you sure you want to enter the chat?");
                  if (confirmChat) {
                    navigate(`/chat/${id}`);
                  }
                }} 
                className="chat-btn"
              >
                Chat
              </button>
            </>
          ) : (
            <button onClick={handleConnect} className="connect-btn">Connect</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;