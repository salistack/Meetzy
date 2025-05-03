import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Header from "../../../components/Header";

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch groups");
        const data = await response.json();
        setGroups(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching groups:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (token && userId) {
      fetchGroups();
    } else {
      setError("Authentication required");
      setIsLoading(false);
    }
  }, [token, userId]);

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Date(date.setHours(0, 0, 0, 0));
  };

  const calculateOverlap = (groupStartDate, groupEndDate, parsedStartDate, parsedEndDate) => {
    if (!parsedStartDate || !parsedEndDate) return 0;
    const overlapStart = Math.max(groupStartDate, parsedStartDate);
    const overlapEnd = Math.min(groupEndDate, parsedEndDate);
    return overlapStart < overlapEnd ? (overlapEnd - overlapStart) / (1000 * 3600 * 24) : 0;
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  const filteredGroups = groups.filter((group) => {
    const groupStart = parseDate(group.startDateTime);
    const groupEnd = parseDate(group.endDateTime);
    const filterStart = parseDate(startDate);
    const filterEnd = parseDate(endDate);

    return (
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filterStart || groupStart >= filterStart) &&
      (!filterEnd || groupEnd <= filterEnd) &&
      (!(filterStart && filterEnd) || (groupStart <= filterEnd && groupEnd >= filterStart))
    );
  });

  // Categorize groups with proper admin/member checks
  const categorizedGroups = filteredGroups.reduce((acc, group) => {
    const isAdmin = group.groupAdmin?._id === userId || group.groupAdmin === userId;
    const isMember = group.members?.some(member => 
      (member?._id === userId) || (member === userId)
    );

    if (isAdmin) {
      acc.admin.push(group);
    } else if (isMember) {
      acc.joined.push(group);
    } else {
      acc.other.push(group);
    }
    return acc;
  }, { admin: [], joined: [], other: [] });

  // Sort each category by date overlap
  const sortCategory = (category) => {
    return category.sort((a, b) => {
      const aOverlap = calculateOverlap(
        parseDate(a.startDateTime),
        parseDate(a.endDateTime),
        parseDate(startDate),
        parseDate(endDate)
      );
      const bOverlap = calculateOverlap(
        parseDate(b.startDateTime),
        parseDate(b.endDateTime),
        parseDate(startDate),
        parseDate(endDate)
      );
      return bOverlap - aOverlap;
    });
  };

  const sortedGroups = [
    ...sortCategory(categorizedGroups.admin),
    ...sortCategory(categorizedGroups.joined),
    ...sortCategory(categorizedGroups.other)
  ];

  const handleConnect = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to join group");
      setGroups(groups.map(g => g._id === groupId ? {
        ...g,
        members: [...g.members, userId]
      } : g));
    } catch (err) {
      console.error("Join error:", err);
      alert(err.message);
    }
  };

  const isUserInGroup = (group) => {
    return group.members?.some(member => 
      (member?._id === userId) || (member === userId)
    );
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-pink-600">
      <div className="text-white text-2xl">Loading groups...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-pink-600">
      <div className="text-white text-2xl">{error}</div>
    </div>
  );

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-pink-600 min-h-screen">
<div className="relative z-10">
      <Header />
    </div>

      {/* Decorative elements */}
      {[...Array(4)].map((_, i) => (
        <div key={`left-${i}`} className={`absolute left-0 w-4 h-4 border-l-4 border-t-4 border-indigo-800 rotate-45 transform -translate-x-1/4 top-${i * 25}%`} />
      ))}
      {[...Array(4)].map((_, i) => (
        <div key={`right-${i}`} className={`absolute right-0 w-4 h-4 border-r-4 border-t-4 border-indigo-800 rotate-45 transform translate-x-1/4 top-${i * 25}%`} />
      ))}

      <div className="container mx-auto px-4 py-8">
        <button
          className="bg-red-600 text-white py-3 px-6 rounded-lg shadow-xl mb-8 hover:bg-indigo-700 transition-all"
          onClick={() => navigate("create")}
        >
          Create Group
        </button>

        <h1 className="text-4xl text-center text-gray-100 mb-8 font-semibold">
          Explore Groups
        </h1>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search groups..."
            className="w-2/3 p-4 rounded-lg border-2 border-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg shadow-md bg-indigo-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-center items-center mb-8 gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <label className="text-lg text-gray-100">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 shadow-md"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-lg text-gray-100">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 shadow-md"
            />
          </div>
          <button
            onClick={handleResetFilters}
            className="bg-gray-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition-all"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedGroups.length > 0 ? sortedGroups.map(group => (
            <div
              key={group._id}
              className="bg-white rounded-lg shadow-xl overflow-hidden hover:scale-105 transition-all"
            >
              <img
                src={`http://localhost:5000${group.image}`}
                alt={group.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300";
                }}
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800">{group.title}</h3>
                <p className="text-gray-600 text-sm mt-2">
                  {new Date(group.startDateTime).toLocaleDateString()} -{" "}
                  {new Date(group.endDateTime).toLocaleDateString()}
                </p>

                <div className="flex justify-center gap-4 mt-6 flex-wrap">
                  {isUserInGroup(group) ? (
                    <button
                      className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-all text-sm"
                      onClick={() => navigate(`/user/groups/${group._id}/chat`)}
                    >
                      Chat
                    </button>
                  ) : (
                    <button
                      className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-all text-sm"
                      onClick={() => handleConnect(group._id)}
                    >
                      Connect
                    </button>
                  )}
                  <button
                    className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-all text-sm"
                    onClick={() => navigate(`/user/groups/${group._id}`)}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center text-white text-xl py-12">
              No groups found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;