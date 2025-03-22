import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${id}`);
        if (response.ok) {
          const groupData = await response.json();
          setGroup(groupData);
          setIsConnected(groupData.isUserConnected);
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
    <div
      className="min-h-screen flex items-center justify-center p-6 relative bg-gradient-to-r from-indigo-600 to-pink-600"
      style={{ overflow: "hidden" }}
    >
      {/* Decorative Circles */}
      <div className="absolute inset-0 z-0 flex justify-center items-center">
        <div className="absolute top-10 left-20 w-32 h-32 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-32 right-10 w-48 h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-40 w-24 h-24 bg-gradient-to-r from-green-400 to-teal-500 rounded-full opacity-30 animate-pulse"></div>
      </div>

      {/* Main Content Box */}
      <div className="relative p-8 max-w-4xl bg-white shadow-2xl rounded-xl backdrop-blur-md border border-gray-200 z-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{group.title}</h2>

        {/* Square Image Container */}
        {group.image && (
          <div className="mt-6 w-64 h-64 mx-auto overflow-hidden rounded-lg border-4 border-indigo-600 shadow-lg flex justify-center items-center">
            <img
              src={`http://localhost:5000${group.image}`}
              alt="Group"
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <p className="mt-4 text-lg text-gray-700"><strong>Location:</strong> {group.location}</p>
        <p className="mt-2 text-lg text-gray-700"><strong>Description:</strong> {group.description}</p>
        <p className="mt-2 text-lg text-gray-700"><strong>Start Date:</strong> {new Date(group.startDateTime).toLocaleString()}</p>
        <p className="mt-2 text-lg text-gray-700"><strong>End Date:</strong> {new Date(group.endDateTime).toLocaleString()}</p>
        {group.numMembers && <p className="mt-2 text-lg text-gray-700"><strong>Max Members:</strong> {group.numMembers}</p>}

        {/* Floating Glassy Connect Button */}
        <button
          onClick={handleConnect}
          className={`px-5 py-2.5 text-white text-lg rounded-full shadow-xl absolute top-6 right-6 transition-all transform hover:scale-105 ${isConnected ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          disabled={isConnected}
        >
          {isConnected ? "Connected" : "Connect"}
        </button>

        {/* Action Buttons */}
        <div className="flex space-x-6 mt-8 justify-center">
          <button
            onClick={handleUpdate}
            className="px-5 py-2.5 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 text-lg font-semibold text-white bg-red-500 rounded-lg shadow-md transition-all hover:bg-red-600 hover:shadow-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
