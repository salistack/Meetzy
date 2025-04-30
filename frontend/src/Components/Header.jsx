import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Header = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-6 flex justify-between items-center relative rounded-lg shadow-lg">
      {/* Logo */}
      <div className="text-3xl font-bold relative z-10 text-shadow-lg">Meetzy</div>
      
      {/* Navigation Menu */}
      <nav className="flex space-x-8 relative z-10">
        <Link to="#" className="hover:scale-105 transition-all duration-300">Create Group</Link>
        <Link to="#" className="hover:scale-105 transition-all duration-300">Create Blog</Link>
        <Link to="#" className="hover:scale-105 transition-all duration-300">About Us</Link>
        <Link to="#" className="hover:scale-105 transition-all duration-300">FAQ</Link>
        <Link to="#" className="hover:scale-105 transition-all duration-300">Contact Us</Link>
      </nav>

      {/* Sign In and Sign Up Buttons */}
      <div className="space-x-4 relative z-10">
        <a href="/signup">
          <button
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-2 px-6 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110"
          >
            Sign Up
          </button>
        </a>
        <button
          className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-6 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110"
          onClick={() => navigate("/login")} // Navigate to LoginPage
        >
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;
