import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });


      // ✅ Store the token for future requests
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data._id);
      
      console.log("Login successful:", response.data);

      


      // Redirect based on user role
      if (response.data.isAdmin) {
        console.log("Redirecting to admin dashboard"); // Debug log
        navigate("/admin/AdminDashboard"); // Redirect to admin dashboard

      } else {
        console.log("Redirecting to user profile"); // Debug log
        navigate("/profile"); // Redirect to user profile
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err); // Debug log
      const errorMessage = err.response?.data?.message || "Login failed";
      if (errorMessage.toLowerCase().includes("invalid credentials")) {
        setError("Invalid password. Forgot your password?");
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-extrabold text-white text-center mb-6">Login</h1>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">
            {error}{" "}
            {error.toLowerCase().includes("invalid password") && (
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                className="text-white font-semibold underline hover:text-yellow-300"
              >
                Reset it here
              </button>
            )}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <label className="block text-white font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-white/50 bg-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            <label className="block text-white font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-white/50 bg-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all"
          >
            Login
          </motion.button>

          <p className="text-center text-white text-sm mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold underline hover:text-yellow-300"
            >
              Signup
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
