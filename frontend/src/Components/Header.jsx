import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/meezy logo copy.svg"
              alt="Meetzy Logo"
              className="h-12 w-auto"
            />
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-800 hover:text-indigo-600 font-medium transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/user/blogs"
              className="text-gray-800 hover:text-indigo-600 font-medium transition duration-300"
            >
              Blog
            </Link>
            <Link
              to="/user/feeds"
              className="text-gray-800 hover:text-indigo-600 font-medium transition duration-300"
            >
              Feed
            </Link>
            <Link
              to="/user/groups"
              className="text-gray-800 hover:text-indigo-600 font-medium transition duration-300"
            >
              Groups
            </Link>
            <Link
              to="/profile"
              className="text-gray-800 hover:text-indigo-600 font-medium transition duration-300"
            >
              Profile
            </Link>

            <Link
              to="/PrivacyPolicy"
              className="text-gray-800 hover:text-indigo-600 font-medium transition duration-300"
            >
              PrivacyPolicy
            </Link>

          </nav>

          {/* Sign In and Sign Up Buttons */}
          <div className="hidden md:flex space-x-4">
            <button
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-600 transition duration-300"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
            <button
              className="bg-indigo-100 text-indigo-700 px-6 py-2 rounded-lg shadow-md hover:bg-indigo-200 transition duration-300"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-gray-800 hover:text-indigo-600 focus:outline-none"
              aria-label="Open Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
