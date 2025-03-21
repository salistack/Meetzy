import React, { useState } from "react";
import { FaSearch, FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { motion } from "framer-motion";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-opacity-90 bg-gray-800 shadow-md">
        <div className="text-2xl font-bold">Meetzy</div>
        <div className="flex items-center space-x-4">
          <FaSearch className="text-xl cursor-pointer hover:text-gray-300" />
          <FaBell className="text-xl cursor-pointer hover:text-gray-300" />
          <FaUserCircle className="text-2xl cursor-pointer hover:text-gray-300" />
          <FaBars
            className="text-2xl cursor-pointer md:hidden hover:text-gray-300"
            onClick={toggleSidebar}
          />
        </div>
      </nav>

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 w-64 h-full bg-gray-800 shadow-lg z-50 md:hidden"
      >
        <div className="flex flex-col items-start p-4 space-y-4">
          <button
            className="self-end text-white text-xl"
            onClick={toggleSidebar}
          >
            ✕
          </button>
          <a href="#" className="text-lg hover:text-gray-300">
            Dashboard
          </a>
          <a href="#" className="text-lg hover:text-gray-300">
            Profile
          </a>
          <a href="#" className="text-lg hover:text-gray-300">
            Settings
          </a>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center py-20 px-6">
        <h1 className="text-5xl font-extrabold mb-4 text-center">
          Welcome to Meetzy
        </h1>
        <p className="text-lg text-center max-w-2xl mb-8">
          Connect, collaborate, and grow with Meetzy. Explore our features and
          make the most out of your experience.
        </p>
        <div className="flex space-x-4">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md text-lg font-medium">
            Get Started
          </button>
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded-lg shadow-md text-lg font-medium">
            Learn More
          </button>
        </div>
        
      </main>

      {/* Footer */}
      <footer className="py-4 bg-gray-800 text-center">
        <p className="text-sm text-gray-400">
          © 2023 Meetzy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;