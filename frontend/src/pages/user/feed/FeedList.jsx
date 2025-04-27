import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaFilter, FaSearch } from "react-icons/fa"; // Importing the icons

const FeedList = () => {
  const [feeds, setFeeds] = useState([]);
  const [filteredFeeds, setFilteredFeeds] = useState([]);
  const [dateFilter, setDateFilter] = useState(""); // State for date filter
  const [showFilterOptions, setShowFilterOptions] = useState(false); // Toggle for filter dropdown visibility
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeeds();
  }, []);

  useEffect(() => {
    // Filter feeds whenever the dateFilter or searchTerm changes
    let filtered = feeds;

    // Apply the search filter (searches by title and content)
    if (searchTerm) {
      filtered = filtered.filter((feed) => 
        feed.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feed.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply the date filter
    if (dateFilter) {
      filtered = filterFeeds(filtered, dateFilter);
    }

    setFilteredFeeds(filtered); // Set the final filtered list
  }, [dateFilter, searchTerm, feeds]);

  const fetchFeeds = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/feeds");
      const data = await response.json();
      setFeeds(data);
      setFilteredFeeds(data); // Initialize filtered feeds with all data
    } catch (error) {
      console.error("Error fetching feeds:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this feed?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/feeds/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Feed deleted successfully");
          fetchFeeds(); // Refresh feeds after deletion
        } else {
          alert("Failed to delete feed");
        }
      } catch (error) {
        console.error("Error deleting feed:", error);
      }
    }
  };

  // Filter function based on selected date filter
  const filterFeeds = (feeds, filter) => {
    const currentDate = new Date();
    let filtered = [];

    switch (filter) {
      case "today":
        filtered = feeds.filter((feed) => {
          const feedDate = new Date(feed.createdAt).toISOString().split("T")[0]; // Remove time for comparison
          return feedDate === currentDate.toISOString().split("T")[0]; // Compare only the date part
        });
        break;
      case "thisWeek":
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0); // Normalize to the start of the day

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Saturday)
        endOfWeek.setHours(23, 59, 59, 999); // Normalize to the end of the day

        filtered = feeds.filter((feed) => {
          const feedDate = new Date(feed.createdAt);
          return feedDate >= startOfWeek && feedDate <= endOfWeek; // Compare the full date and time
        });
        break;
      case "thisMonth":
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the month
        filtered = feeds.filter((feed) => {
          const feedDate = new Date(feed.createdAt);
          return feedDate >= startOfMonth && feedDate <= endOfMonth; // Within this month
        });
        break;
      default:
        filtered = feeds; // No filter
        break;
    }

    return filtered;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Feeds</h1>
        <button
          onClick={() => navigate("/user/feeds/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Feed
        </button>
      </div>

      {/* Centered Search Section */}
      <div className="mb-4 flex justify-center">
        <div className="flex items-center gap-4 w-full max-w-2xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term as user types
            placeholder="Search feeds..."
            className="p-3 border rounded w-full"
          />
          <FaSearch size={20} className="text-gray-500" />
        </div>
      </div>

      {/* Filter Button with Dropdown */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilterOptions(!showFilterOptions)} // Toggle filter options
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <FaFilter size={16} /> Filter
        </button>

        {showFilterOptions && (
          <div className="mt-2 bg-white shadow-lg rounded p-2 absolute">
            <button
              onClick={() => setDateFilter("today")}
              className="block w-full text-left p-2 hover:bg-gray-100"
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter("thisWeek")}
              className="block w-full text-left p-2 hover:bg-gray-100"
            >
              This Week
            </button>
            <button
              onClick={() => setDateFilter("thisMonth")}
              className="block w-full text-left p-2 hover:bg-gray-100"
            >
              This Month
            </button>
          </div>
        )}
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {filteredFeeds.map((feed) => (
          <div
            key={feed._id}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-2"
          >
            <h2 className="text-xl font-semibold">{feed.title}</h2>
            <p className="text-gray-700">{feed.content}</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Feeling: {feed.feeling}</span>
              <span>Location: {feed.location}</span>
              <span>Date: {new Date(feed.createdAt).toLocaleString()}</span>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => navigate(`/user/feeds/edit/${feed._id}`)}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                <FaEdit size={16} /> {/* Pencil icon for Edit */}
              </button>
              <button
                onClick={() => handleDelete(feed._id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                <FaTrash size={16} /> {/* Trash bin icon for Delete */}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedList;
