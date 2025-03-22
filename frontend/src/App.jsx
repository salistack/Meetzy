import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios
import Header from "./Components/Header"; 
import CreateProfile from "./pages/user/profile/CreateProfile";

function App() {
  const navigate = useNavigate(); // Initialize navigation
  const [broadcastMessages, setBroadcastMessages] = useState([]); // State for broadcast messages

  useEffect(() => {
    // Fetch broadcast messages on component mount
    const fetchBroadcastMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/broadcasts"); // Update with your API URL
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

      <div className="broadcast-messages" style={{ textAlign: "center", margin: "20px 0" }}>
        <h2
          style={{
            animation: "pulse 1.5s infinite",
            color: "red",
            fontSize: "24px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Broadcast Messages
        </h2>
        {broadcastMessages.length > 0 ? (
          broadcastMessages.map((msg) => (
            <div
              key={msg._id}
              style={{
                display: "inline-block",
                border: "5px solid red",
                borderRadius: "10px",
                padding: "5px",
                marginBottom: "5px",
                backgroundColor: "#ffe6e6",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                animation: "fadeIn 3s ease-in-out, blinkBorder 10s infinite alternate"
              }}
              
            >
              <p style={{ fontSize: "18px", fontWeight: "500", color: "#333" }}>{msg.message}</p>
            </div>
          ))
        ) : (
          <p style={{ fontSize: "16px", color: "#666" }}>No broadcast messages</p>
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
        <button className="group-button" onClick={() => navigate("/group")}>
          Group Panel
        </button>
      </div>

      <div className="profile">
        <button className="profile-button" onClick={() => navigate("/create-profile")}>
          Profile Panel
        </button>
      </div>

      <div className="feed">
        <button className="feed-button" onClick={() => navigate("/feed")}>
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
