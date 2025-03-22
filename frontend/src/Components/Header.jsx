import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Header = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">Meetzy</div>
      <nav className="flex space-x-4">
        <a href="#" className="hover:underline">Create Group</a>
        <a href="#" className="hover:underline">About Us</a>
        <a href="#" className="hover:underline">FAQ</a>
        <a href="#" className="hover:underline">Contact Us</a>
      </nav>
      <div className="space-x-2">
        <a href="/signup">
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            onClick={() => {
              fetch("http://localhost:5000/api/auth/register", { // Updated to use the correct backend URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: "testuser", password: "testpassword" }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Failed to register");
                  }
                  return response.json();
                })
                .then((data) => console.log("Registration successful:", data))
                .catch((error) => console.error("Error:", error));
            }}
          >
            Sign Up
          </button>
        </a>
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          onClick={() => navigate("/LoginPage")} // Navigate to LoginPage
        >
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;
