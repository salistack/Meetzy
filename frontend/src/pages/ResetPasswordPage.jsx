import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
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
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset password failed");
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <motion.form
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onSubmit={handleResetPassword}
        className="w-full max-w-md p-8 bg-white/20 backdrop-blur-lg rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">Reset Password</h2>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center mb-4">{success}</p>}

        <motion.input
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-white/50 bg-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />

        <motion.input
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-white/50 bg-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />

        <motion.input
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border border-white/50 bg-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-2 text-gray-900 bg-yellow-400 rounded-lg font-bold hover:bg-yellow-500"
        >
          Reset Password
        </motion.button>

        <p className="text-center text-white text-sm mt-4">
          Remembered your password?{" "}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-semibold underline hover:text-yellow-300"
          >
            Login
          </button>
        </p>
      </motion.form>
    </div>
  );
};

export default ResetPasswordPage;
