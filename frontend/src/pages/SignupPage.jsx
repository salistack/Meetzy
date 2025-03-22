import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Added for navigation

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Add confirmPassword state
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      console.log("Signup successful:", response.data);
      navigate("/"); // Navigate to home page after successful signup
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Signup</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Signup
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Do you have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")} // Navigate to login page
            className="text-blue-500 hover:underline"
          >
            Login
          </button>
        </p>
        
      </form>
    </div>
  );
};

export default SignupPage;