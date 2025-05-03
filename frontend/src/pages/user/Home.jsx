import React, { useState, useEffect } from "react";
import { FaUsers, FaBlog, FaComments, FaLayerGroup, FaRobot } from "react-icons/fa";
import Header from "../../components/Header";
import ChatBot from "../../components/ChatBot";
import axios from "axios";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";

function LandingPage() {
  const [broadcastMessages, setBroadcastMessages] = useState([]);

  useEffect(() => {
    const fetchBroadcastMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/broadcasts");
        setBroadcastMessages(response.data.broadcasts);
      } catch (error) {
        console.error("Error fetching broadcast messages:", error);
      }
    };
    fetchBroadcastMessages();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-50 text-gray-900 font-poppins">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section id="home" className="py-16 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-center md:text-left">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight text-gray-800">
              Welcome to <span className="text-indigo-600">Meetzy</span>
            </h1>
            <p className="text-lg text-gray-600">
              Discover a world of opportunities to connect, share, and grow with like-minded individuals. Trusted by <span className="font-bold text-indigo-600">10K+ members</span>.
            </p>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center md:justify-start">
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:bg-indigo-700 transition duration-300">
                Join Now
              </button>
              <button className="bg-gray-100 text-gray-800 px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition duration-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src="/image/234664c9-0160-4fbf-ba47-26a9b2540046.png"
              alt="Hero Placeholder"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Broadcast Section */}
      <section className="broadcast-messages px-4 md:px-8 lg:px-16 py-12 text-center font-poppins bg-white flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-indigo-600 mb-10">
          Latest Announcements
        </h2>

        {broadcastMessages.length > 0 ? (
          <div className="grid gap-6 max-w-3xl w-full">
            {broadcastMessages.map((msg) => (
              <div
                key={msg._id}
                className="border border-indigo-200 rounded-2xl p-6 bg-indigo-50 shadow-md hover:shadow-xl transition-shadow duration-300 text-left"
              >
                <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base text-gray-500 mt-4">No messages available</p>
        )}
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50">
        {/* Feature 1 */}
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-16">
          <div className="md:w-1/2 text-center md:text-left space-y-6 md:pr-12">
            <h2 className="text-4xl font-bold text-gray-800">Read Blogs</h2>
            <p className="text-lg text-gray-600">
              Stay updated with the latest community insights and articles written by experts and members. Explore a wide range of topics, including technology, lifestyle, health, and more, curated to keep you informed and inspired.
            </p>
            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition duration-300">
              Explore Blogs
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
            <img
              src="/image/worker-reading-news-with-tablet.jpg"
              alt="Read Blogs"
              className="w-full h-auto rounded-lg shadow-lg max-w-lg"
            />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="min-h-screen flex flex-col md:flex-row-reverse items-center justify-center px-6 py-16 bg-gray-100">
          <div className="md:w-1/2 text-center md:text-left space-y-6 md:pl-12">
            <h2 className="text-4xl font-bold text-gray-800">Community Feed</h2>
            <p className="text-lg text-gray-600">
              Engage with posts from members around the globe and share your thoughts with the community. Discover trending discussions, participate in polls, and connect with others through meaningful conversations.
            </p>
            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition duration-300">
              View Feed
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
            <img
              src="/image/diverse-friends-students-shoot.jpg"
              alt="Community Feed"
              className="w-full h-auto rounded-lg shadow-lg max-w-lg"
            />
          </div>
        </div>

        {/* Feature 3 */}
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-16">
          <div className="md:w-1/2 text-center md:text-left space-y-6 md:pr-12">
            <h2 className="text-4xl font-bold text-gray-800">Join Groups</h2>
            <p className="text-lg text-gray-600">
              Connect with groups that match your interests and participate in meaningful discussions. Whether you're into technology, art, fitness, or any other passion, there's a group waiting for you.
            </p>
            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition duration-300">
              Find Groups
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
            <img
              src="/image/strength-people-hands-success-meeting.jpg"
              alt="Join Groups"
              className="w-full h-auto rounded-lg shadow-lg max-w-lg"
            />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-indigo-400">MeetZY</h3>
              <p className="text-gray-400">
                Connecting people through shared interests and meaningful conversations.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Events
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaMapMarkerAlt className="mt-1 mr-3 text-indigo-400" />
                  <span className="text-gray-400">123 Community St, Tech City, TC 12345</span>
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="mr-3 text-indigo-400" />
                  <span className="text-gray-400">contact@meetzy.com</span>
                </li>
                <li className="flex items-center">
                  <FaPhone className="mr-3 text-indigo-400" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} MeetZY. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Chatbot Button */}
      <ChatBot />
    </div>
  );
}

export default LandingPage;