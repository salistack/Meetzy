import React, { useState, useEffect } from "react";
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
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      console.log(response.data); // Log the response for debugging
      setSuccess("Signup successful! Please check your email for the OTP.");
      setError("");
      setStep(2);
    } catch (err) {
      console.error(err.response?.data); // Log the error response
      setError(err.response?.data?.message || "Signup failed");
      setSuccess("");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      console.log({ email, otp }); // Debug: Log the payload being sent
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      console.log(response.data); // Debug: Log the response
      setSuccess("Verification successful! Redirecting...");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err.response?.data); // Debug: Log the error response
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    try {
      await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      {step === 1 && (
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
      )}
      {step === 2 && (
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onSubmit={handleVerifyOTP}
          className="w-full max-w-md p-8 bg-white/20 backdrop-blur-lg rounded-xl shadow-xl"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-6">Verify OTP</h2>
          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-green-400 text-sm text-center mb-4">{success}</p>}

          <div className="space-y-4">
            <motion.input
              whileFocus={{ scale: 1.05 }}
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-3 border border-white/50 bg-transparent text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full mt-6 py-3 text-gray-900 bg-yellow-400 rounded-xl font-bold hover:bg-yellow-500 transition duration-300"
          >
            Verify OTP
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleResendOTP}
            disabled={resendTimer > 0}
            className="w-full mt-4 py-3 text-gray-900 bg-yellow-400 rounded-xl font-bold hover:bg-yellow-500 transition duration-300"
          >
            Resend OTP {resendTimer > 0 && `(${resendTimer}s)`}
          </motion.button>
        </motion.form>
      )}
    </div>
  );
};

export default SignupPage;
