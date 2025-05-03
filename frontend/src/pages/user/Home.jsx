import React, { useState, useEffect } from "react";
import { FaUsers, FaBlog, FaComments, FaLayerGroup, FaRobot } from "react-icons/fa";
import Header from "../../components/Header";
import ChatBot from "../../components/ChatBot"; // Import ChatBot component
import axios from "axios";

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
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h2 className="text-4xl font-bold text-gray-800">Read Blogs</h2>
            <p className="text-lg text-gray-600">
              Stay updated with the latest community insights and articles written by experts and members. Explore a wide range of topics, including technology, lifestyle, health, and more, curated to keep you informed and inspired.
            </p>
            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition duration-300">
              Explore Blogs
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/image/blogs.jpg"
              alt="Read Blogs"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="min-h-screen flex flex-col md:flex-row-reverse items-center justify-center px-6 py-16 bg-gray-100">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h2 className="text-4xl font-bold text-gray-800">Community Feed</h2>
            <p className="text-lg text-gray-600">
              Engage with posts from members around the globe and share your thoughts with the community. Discover trending discussions, participate in polls, and connect with others through meaningful conversations.
            </p>
            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition duration-300">
              View Feed
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/image/community-feed.jpg"
              alt="Community Feed"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Feature 3 */}
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-16">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h2 className="text-4xl font-bold text-gray-800">Join Groups</h2>
            <p className="text-lg text-gray-600">
              Connect with groups that match your interests and participate in meaningful discussions. Whether you're into technology, art, fitness, or any other passion, there's a group waiting for you.
            </p>
            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition duration-300">
              Find Groups
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/image/join-groups.jpg"
              alt="Join Groups"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Feature 4 */}
        <div className="min-h-screen flex flex-col md:flex-row-reverse items-center justify-center px-6 py-16 bg-gray-100">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h2 className="text-4xl font-bold text-gray-800">Group Activities</h2>
            <p className="text-lg text-gray-600">
              Participate in exciting group events and activities to build stronger connections. From virtual meetups to collaborative projects, there's always something happening in our vibrant community.
            </p>
            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition duration-300">
              Explore Activities
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/image/group-activities.jpg"
              alt="Group Activities"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Sticky Chatbot Button */}
      <ChatBot /> {/* Render ChatBot component */}
      
    </div>
  );
}

export default LandingPage;
