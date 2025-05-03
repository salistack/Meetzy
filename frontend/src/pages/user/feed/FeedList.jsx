import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaFilter,
  FaSearch,
  FaHeart,
} from "react-icons/fa";

const FeedList = () => {
  // State variables
  const [feeds, setFeeds] = useState([]); // All feeds fetched from backend
  const [filteredFeeds, setFilteredFeeds] = useState([]); // Feeds to display after filters/search
  const [dateFilter, setDateFilter] = useState(""); // Current date filter: today, thisWeek, or thisMonth
  const [showFilterOptions, setShowFilterOptions] = useState(false); // Show/hide filter dropdown
  const [searchTerm, setSearchTerm] = useState(""); // Current text in search input
  const navigate = useNavigate();

  // Fetch feeds on component mount
  useEffect(() => {
    fetchFeeds();
  }, []);

  // Filter and sort feeds when feeds, searchTerm, or dateFilter changes
  useEffect(() => {
    let filtered = feeds;

    // Filter by search term (title/content)
    if (searchTerm) {
      filtered = filtered.filter(
        (feed) =>
          feed.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          feed.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter) {
      filtered = filterFeeds(filtered, dateFilter);
    }

    // Sort by creation date (newest first)
    const sortedFeeds = [...filtered].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setFilteredFeeds(sortedFeeds);
  }, [dateFilter, searchTerm, feeds]);

  // Fetch feeds from backend
  const fetchFeeds = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/feeds");
      const data = await response.json();
      setFeeds(data);
      setFilteredFeeds(data);
    } catch (error) {
      console.error("Error fetching feeds:", error);
    }
  };

  // Delete feed by ID
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this feed?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/feeds/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Feed deleted successfully");
          fetchFeeds(); // Refresh feed list
        } else {
          alert("Failed to delete feed");
        }
      } catch (error) {
        console.error("Error deleting feed:", error);
      }
    }
  };

  // Like or unlike a feed
  const handleLike = async (id) => {
    // Optimistically update local state
    const updatedFeeds = feeds.map((feed) => {
      if (feed._id === id) {
        const updatedLikes = feed.likedByUser ? feed.likes - 1 : feed.likes + 1;
        const likedByUser = !feed.likedByUser;
        return { ...feed, likes: updatedLikes, likedByUser };
      }
      return feed;
    });

    setFeeds(updatedFeeds);

    // Send like/unlike to backend
    try {
      const feedToUpdate = updatedFeeds.find((feed) => feed._id === id);
      await fetch(`http://localhost:5000/api/feeds/${id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          likedByUser: feedToUpdate.likedByUser,
          likes: feedToUpdate.likes,
        }),
      });
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  // Filter feeds by date: today, this week, or this month
  const filterFeeds = (feeds, filter) => {
    const currentDate = new Date();
    switch (filter) {
      case "today":
        return feeds.filter(
          (feed) =>
            new Date(feed.createdAt).toISOString().split("T")[0] ===
            currentDate.toISOString().split("T")[0]
        );
      case "thisWeek": {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return feeds.filter((feed) => {
          const feedDate = new Date(feed.createdAt);
          return feedDate >= startOfWeek && feedDate <= endOfWeek;
        });
      }
      case "thisMonth": {
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        return feeds.filter((feed) => {
          const feedDate = new Date(feed.createdAt);
          return feedDate >= startOfMonth && feedDate <= endOfMonth;
        });
      }
      default:
        return feeds;
    }
  };

  // Generate random animated drops behind each letter in the title
  const generateDrops = () => {
    const drops = [];
    const count = 3 + Math.floor(Math.random() * 2); // 3-4 drops
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      drops.push(
        <span
          key={i}
          className="drop"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      );
    }
    return drops;
  };

  return (
    <div className="min-h-screen bg-white-100 p-6 relative">
      {/* Page Header */}
      <Header />

      {/* Page Title with animated drops */}
      <div className="flex justify-between items-center mb-6 mt-4">
        <h1 className="text-3xl font-bold flex gap-2 relative">
          {"Feeds".split("").map((char, index) => (
            <span key={index} className="relative drop-container">
              {char}
              {generateDrops()}
            </span>
          ))}
        </h1>
        <button
          onClick={() => navigate("/user/feeds/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Feed
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <div className="flex items-center gap-4 w-full max-w-2xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search feeds..."
            className="p-3 border rounded w-full"
          />
          <FaSearch size={20} className="text-gray-500" />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 flex gap-2 items-center">
        <button
          onClick={() => setShowFilterOptions(!showFilterOptions)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <FaFilter size={16} /> Filter
        </button>
        <button
          onClick={() => {
            setDateFilter("");
            setSearchTerm("");
            setShowFilterOptions(false);
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Reset Filters
        </button>
      </div>

      {/* Filter Options Dropdown */}
      {showFilterOptions && (
        <div className="mt-2 bg-white shadow-lg rounded p-2 absolute z-10">
          {["today", "thisWeek", "thisMonth"].map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => {
                setDateFilter(filterKey);
                setShowFilterOptions(false);
              }}
              className="block w-full text-left p-2 hover:bg-gray-100 capitalize"
            >
              {filterKey.replace(/([A-Z])/g, " $1")}
            </button>
          ))}
        </div>
      )}

      {/* Feed Cards */}
      <div className="space-y-6 mt-4">
        {filteredFeeds.length === 0 ? (
          <div className="text-center text-gray-500">No feeds found.</div>
        ) : (
          filteredFeeds.map((feed) => (
            <div
              key={feed._id}
              className="relative bg-white/20 backdrop-blur-lg border border-white/30 p-6 rounded-2xl shadow-lg transition hover:shadow-xl"
            >
              <h2 className="text-2xl font-semibold text-center">{feed.title}</h2>
              <p className="text-gray-700">{feed.content}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Feeling: {feed.feeling}</span>
                <span>Location: {feed.location}</span>
                <span>Date: {new Date(feed.createdAt).toLocaleString()}</span>
              </div>
              {feed.YourName && (
                <div className="text-sm text-gray-600 mt-2">
                  Created by: {feed.YourName}
                </div>
              )}

              {/* Like Button */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => handleLike(feed._id)}
                  className="hover:scale-110 transition"
                >
                  <FaHeart
                    size={24}
                    color={feed.likedByUser ? "red" : "white"}
                    className="drop-shadow"
                  />
                </button>
                <span className="text-gray-700">{feed.likes || 0}</span>
              </div>

              {/* Edit & Delete Buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => navigate(`/user/feeds/edit/${feed._id}`)}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  <FaEdit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(feed._id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Drop Animation CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .drop-container {
              display: inline-block;
              position: relative;
            }
            .drop {
              position: absolute;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: #1E90FF;
              animation: bounce 1.5s ease-in-out infinite;
            }
            @keyframes bounce {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-4px);
              }
            }
          `,
        }}
      />
    </div>
  );
};

export default FeedList;
