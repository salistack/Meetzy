import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GroupPage.css";
import "./index.css";

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

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.setHours(0, 0, 0, 0));
  };

  const calculateOverlap = (groupStartDate, groupEndDate, parsedStartDate, parsedEndDate) => {
    if (!parsedStartDate || !parsedEndDate) return 0;

    const overlapStart = Math.max(groupStartDate, parsedStartDate);
    const overlapEnd = Math.min(groupEndDate, parsedEndDate);

    if (overlapStart >= overlapEnd) return 0;

    const overlapDuration = (overlapEnd - overlapStart) / (1000 * 3600 * 24);
    return overlapDuration;
  };

  const filteredGroups = groups.filter((group) => {
    const groupStartDate = parseDate(group.startDateTime);
    const groupEndDate = parseDate(group.endDateTime);
    const parsedStartDate = startDate ? parseDate(startDate) : null;
    const parsedEndDate = endDate ? parseDate(endDate) : null;

    const startDateFilter = parsedStartDate ? groupStartDate >= parsedStartDate : true;
    const endDateFilter = parsedEndDate ? groupEndDate <= parsedEndDate : true;
    const dateRangeFilter = (parsedStartDate && parsedEndDate)
      ? groupStartDate <= parsedEndDate && groupEndDate >= parsedStartDate
      : true;

    return (
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      startDateFilter &&
      endDateFilter &&
      dateRangeFilter
    );
  });

  const sortedGroups = filteredGroups.sort((a, b) => {
    const groupAStartDate = parseDate(a.startDateTime);
    const groupAEndDate = parseDate(a.endDateTime);
    const groupBStartDate = parseDate(b.startDateTime);
    const groupBEndDate = parseDate(b.endDateTime);
    const parsedStartDate = startDate ? parseDate(startDate) : null;
    const parsedEndDate = endDate ? parseDate(endDate) : null;

    const overlapA = calculateOverlap(groupAStartDate, groupAEndDate, parsedStartDate, parsedEndDate);
    const overlapB = calculateOverlap(groupBStartDate, groupBEndDate, parsedStartDate, parsedEndDate);

    return overlapB - overlapA;
  });

  const handleConnect = (id) => {
    alert(`You have connected with Group ID: ${id}`);
  };

  const handleDetails = (id) => {
    navigate(`/user/groups/${id}`);
  };

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-pink-600 min-h-screen">
      {/* Triangles on the sides */}
      <div className="absolute top-0 left-0 w-4 h-4 bg-transparent border-l-4 border-t-4 border-indigo-800 rotate-45 transform translate-x-[-10%] translate-y-[10%]"></div>
      <div className="absolute top-1/4 left-0 w-4 h-4 bg-transparent border-l-4 border-t-4 border-indigo-800 rotate-45 transform translate-x-[-10%] translate-y-[30%]"></div>
      <div className="absolute top-1/2 left-0 w-4 h-4 bg-transparent border-l-4 border-t-4 border-indigo-800 rotate-45 transform translate-x-[-10%] translate-y-[50%]"></div>
      <div className="absolute top-3/4 left-0 w-4 h-4 bg-transparent border-l-4 border-t-4 border-indigo-800 rotate-45 transform translate-x-[-10%] translate-y-[70%]"></div>

      <div className="absolute top-0 right-0 w-4 h-4 bg-transparent border-r-4 border-t-4 border-indigo-800 rotate-45 transform translate-x-[10%] translate-y-[10%]"></div>
      <div className="absolute top-1/4 right-0 w-4 h-4 bg-transparent border-r-4 border-t-4 border-indigo-800 rotate-45 transform translate-x-[10%] translate-y-[30%]"></div>
      <div className="absolute top-1/2 right-0 w-4 h-4 bg-transparent border-r-4 border-t-4 border-indigo-800 rotate-45 transform translate-x-[10%] translate-y-[50%]"></div>
      <div className="absolute top-3/4 right-0 w-4 h-4 bg-transparent border-r-4 border-t-4 border-indigo-800 rotate-45 transform translate-x-[10%] translate-y-[70%]"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Create Group Button */}
        <button
          className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-xl mb-8 hover:bg-indigo-700 transform hover:scale-105 transition duration-300"
          onClick={() => navigate('create')}
        >
          Create Group
        </button>

        <h1 className="text-4xl text-center text-gray-100 mb-8 font-semibold">Explore Groups</h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search groups..."
            className="w-2/3 p-4 rounded-lg border-2 border-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg shadow-md bg-indigo-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Date Filter */}
        <div className="flex justify-center items-center mb-8 space-x-6">
          <div className="flex items-center space-x-3">
            <label className="text-lg text-gray-100">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-3 border-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
            />
          </div>

          <div className="flex items-center space-x-3">
            <label className="text-lg text-gray-100">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-3 border-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
            />
          </div>
        </div>

        {/* Group Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedGroups.map((group) => (
            <div key={group._id} className="bg-white rounded-lg shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-2xl transition duration-300">
              <img
                src={`http://localhost:5000${group.image}`}
                alt={group.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl text-gray-800 font-semibold">{group.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{new Date(group.startDateTime).toLocaleDateString()} - {new Date(group.endDateTime).toLocaleDateString()}</p>

                {/* Buttons Section */}
                <div className="flex justify-center gap-6 mt-6">
                  <button
                    className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transform hover:scale-105 transition duration-300"
                    onClick={() => handleConnect(group._id)}
                  >
                    Connect
                  </button>
                  <button
                    className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transform hover:scale-105 transition duration-300"
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
    </div>
  );
};

export default GroupsPage;
