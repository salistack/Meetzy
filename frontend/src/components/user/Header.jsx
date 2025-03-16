import React from "react";
import "./Header.css"; // Import CSS for styling

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Meetzy</div>
      <nav className="nav-menu">
        <a href="#">Create Group</a>
        <a href="#">About Us</a>
        <a href="#">FAQ</a>
        <a href="#">Contact Us</a>
      </nav>
      <div className="auth-buttons">
        <button className="signup">Sign Up</button>
        <button className="login">Login</button>
      </div>
    </header>
  );
};

export default Header;
