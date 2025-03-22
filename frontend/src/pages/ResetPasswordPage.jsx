import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, newPassword }
      );
      setSuccess(response.data.message);
      setError("");
      setTimeout(() => navigate("/"), 2000); // Navigate to home page after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Reset password failed");
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleResetPassword}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} // New confirm password field
          className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;