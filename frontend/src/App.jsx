import React from "react";
import Header from "./components/user/Header"; 



function App() {
  return (
    <>
      <Header />
      
      <div class="dashboard-container">
        <button class="admin-button" onclick="goToAdminPanel()">Go to Admin Panel</button>
    </div>

    <div class="blog">
        <button class="blog" onclick="goToAdminPanel()">blog Panel</button>
    </div>

    <div class="group">
        <button class="group" onclick="goToAdminPanel()">group Panel</button>
    </div>
      
    <div class="profile">
        <button class="profile" onclick="goToAdminPanel()">profil Panel</button>
    </div>

    <div class="feed">
        <button class="feed" onclick="goToAdminPanel()">feed Panel</button>
    </div>
    
    </>
  );
}

export default App;
