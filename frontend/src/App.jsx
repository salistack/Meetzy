import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Home from "./pages/user/Home";
import './index.css';
import './App.css';

function App() {
  const navigate = useNavigate(); 
  const [broadcastMessages, setBroadcastMessages] = useState([]);

  useEffect(() => {
    const fetchBroadcastMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/broadcasts");
        setBroadcastMessages(response.data.broadcasts);
      } catch (error) {
        console.error("Error fetching broadcast messages:", error);
      }
    };
    fetchBroadcastMessages();
  }, []);

  return (
    <>
      <Header />
      <Home />

      <div className="broadcast-messages text-center my-5">
        <h2 className="animate-pulse text-red-500 text-2xl font-bold uppercase">
          {/* Add dynamic content here */}
        </h2>
        {broadcastMessages.length > 0 ? (
          broadcastMessages.map((msg) => (
            <div
              key={msg._id}
              className="inline-block border-4 border-red-500 rounded-lg p-2 mb-2 bg-red-100 text-center shadow-lg animate-fadeIn"
            >
              <p className="text-lg font-medium text-gray-800">{msg.message}</p>
            </div>
          ))
        ) : (
          <p className="text-base text-gray-500">No messages available</p>
        )}
      </div>

      <div className="dashboard-container">
        <button className="admin-button" onClick={() => navigate("/admin/AdminDashboard")}>
          Go to Admin Panel
        </button>
      </div>

      <div className="blog">
        <button className="blog-button" onClick={() => navigate("/user/blogs")}>
          Blog
        </button>
      </div>

      <div className="group">
        <button className="group-button" onClick={() => navigate("/user/groups")}>
          Group Panel
        </button>
      </div>

      <div className="profile">
        <button className="profile-button" onClick={() => navigate("/profile")}>
          Profile Panel
        </button>
      </div>

      <div className="feed">
        <button className="feed-button" onClick={() => navigate("/user/feeds")}>
          Feed Panel
        </button>
      </div>

      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
}

export default App;
