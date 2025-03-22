import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
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
      setSuccess("Signup successful! Redirecting...");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <motion.form
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onSubmit={handleSignup}
        className="w-full max-w-md p-8 bg-white/20 backdrop-blur-lg rounded-xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">Signup</h2>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center mb-4">{success}</p>}

        <div className="space-y-4">
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-white/50 bg-transparent text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-white/50 bg-transparent text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-white/50 bg-transparent text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-white/50 bg-transparent text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full mt-6 py-3 text-gray-900 bg-yellow-400 rounded-xl font-bold hover:bg-yellow-500 transition duration-300"
        >
          Signup
        </motion.button>

        <p className="text-center text-white text-sm mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold underline hover:text-yellow-300"
          >
            Login
          </button>
        </p>
      </motion.form>
    </div>
  );
};

export default SignupPage;
