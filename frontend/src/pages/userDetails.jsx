import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const search = filter.trim(); // Get the current filter value

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/users/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { search }, // Send the filter term as a query parameter
        });

        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filter]); // Re-fetch users when filter changes

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      setFilteredUsers((prevFilteredUsers) => prevFilteredUsers.filter((user) => user._id !== id));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleFilter = (e) => {
    setFilter(e.target.value); // Update the filter state with the input value
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("User Details Report", 14, 20);

    doc.setFontSize(12);

    // Display total users count
    doc.text(`Total Users: ${filteredUsers.length}`, 14, 30);

    // Add headers for the table
    doc.text("Full Name", 14, 40);
    doc.text("Email", 80, 40);
    doc.text("Phone", 150, 40);

    let y = 50;

    // Loop through the filtered users and add their data to the PDF
    filteredUsers.forEach((user) => {
      const fullName = user.fullName || "N/A"; // Default to 'N/A' if empty or undefined
      const email = user.email || "N/A"; // Default to 'N/A' if empty or undefined
      const phoneNumber = user.phoneNumber || "N/A"; // Default to 'N/A' if empty or undefined

      doc.text(fullName, 14, y);
      doc.text(email, 80, y);
      doc.text(phoneNumber, 150, y);

      y += 10; // Increase the y-coordinate for the next line

      // If the y-position exceeds the page height, add a new page
      if (y > 270) {
        doc.addPage();
        y = 20; // Reset y-coordinate after adding a new page
      }
    });

    // Save the generated PDF
    doc.save("user_details.pdf");
  };

  if (loading) {
    return <div className="text-center mt-4">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-500 text-white py-10">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-6">All Users</h2>

        <input
          type="text"
          placeholder="Search by name or email"
          value={filter}
          onChange={handleFilter}
          className="mb-6 p-2 w-full bg-white/50 text-black rounded"
        />

        <button
          onClick={generatePDF} // Call the generatePDF function here
          className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg mb-6"
        >
          Generate PDF
        </button>

        <table className="min-w-full table-auto text-center">
          <thead>
            <tr className="bg-blue-400 text-white">
              <th className="py-2 px-4">Full Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="bg-white/10">
                  <td className="py-2 px-4">{user.fullName}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.phoneNumber}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => navigate(`/admin/user-details/${user._id}`)}
                      className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetails;