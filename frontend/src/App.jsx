import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "./Components/Header"; 

function App() {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <>
      <Header />

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
        <button className="profile-button" onClick={() => navigate("/profile")}>
          Profile Panel
        </button>
      </div>

      <div className="feed">
        <button className="feed-button" onClick={() => navigate("/feed")}>
          Feed Panel
        </button>
      </div>
    </>
  );
}

export default App;
