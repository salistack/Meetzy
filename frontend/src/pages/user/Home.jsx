import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-700 text-white flex flex-col">
      {/* Navbar */}
      

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold mb-4"
        >
          Elevate Your Experience with BrandName
        </motion.h1>
        <p className="text-lg max-w-2xl mb-6">
          Discover a seamless way to connect, collaborate, and grow. Join us today and unlock the potential of your business.
        </p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-300"
        >
          <span>Get Started</span>
          <FaArrowRight />
        </motion.button>
      </main>

      {/* Footer */}
      <footer className="py-4 bg-gray-900 text-center">
        <p className="text-sm text-gray-400">© 2025 BrandName. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
