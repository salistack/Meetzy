import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GroupPage.css";

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/groups");
        if (response.ok) {
          const data = await response.json();
          setGroups(data);
        } else {
          alert("Failed to fetch groups.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchGroups();
  }, []);

  // Convert a date to a comparable Date object, ignoring the time portion
  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.setHours(0, 0, 0, 0)); // Set to midnight to ignore time part
  };

  // Filter groups based on search query and date range
  const filteredGroups = groups.filter((group) => {
    const groupStartDate = parseDate(group.startDateTime);
    const groupEndDate = parseDate(group.endDateTime);
    const parsedStartDate = startDate ? parseDate(startDate) : null;
    const parsedEndDate = endDate ? parseDate(endDate) : null;

    const startDateFilter = parsedStartDate
      ? groupStartDate >= parsedStartDate
      : true;

    const endDateFilter = parsedEndDate
      ? groupEndDate <= parsedEndDate
      : true;

    const dateRangeFilter =
      (parsedStartDate && parsedEndDate)
        ? groupStartDate <= parsedEndDate && groupEndDate >= parsedStartDate
        : true;

    return (
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      startDateFilter &&
      endDateFilter &&
      dateRangeFilter
    );
  });

  // Handle Connect Button (Placeholder for now)
  const handleConnect = (id) => {
    alert(`You have connected with Group ID: ${id}`);
  };

  // Navigate to Group Details Page
  const handleDetails = (id) => {
    navigate(`/user/groups/${id}`);
  };

  return (
    <div className="groups-container">
      <h1 className="page-title">Groups</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search groups..."
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Date Filter */}
      <div className="date-filter">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Group Grid */}
      <div className="groups-grid">
        {filteredGroups.map((group) => (
          <div key={group._id} className="group-card">
            <img
              src={`http://localhost:5000${group.image}`}
              alt={group.title}
              className="group-image"
            />
            <div className="group-info">
              <h3>{group.title}</h3>
              <p>
                {new Date(group.startDateTime).toLocaleDateString()} -{" "}
                {new Date(group.endDateTime).toLocaleDateString()}
              </p>

              {/* Buttons Section */}
              <div className="button-group">
                <button
                  className="connect-btn"
                  onClick={() => handleConnect(group._id)}
                >
                  Connect
                </button>
                <button
                  className="details-btn"
                  onClick={() => handleDetails(group._id)}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsPage;
