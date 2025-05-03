import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const GroupAdminPage = () => {
  const [data, setData] = useState({
    totalCount: 0,
    groups: []
  });
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/groups/count`);
        setData(response.data);
        setFilteredGroups(response.data.groups);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupData();
  }, []);

  const parseDate = (dateStr) => dateStr ? new Date(dateStr).setHours(0, 0, 0, 0) : null;

  useEffect(() => {
    const parsedStart = parseDate(startDate);
    const parsedEnd = parseDate(endDate);

    const result = data.groups.filter((group) => {
      const groupStart = parseDate(group.startDateTime);
      const groupEnd = parseDate(group.endDateTime);

      // Search by email (both creator and admin)
      const matchesEmail = 
        group.createdBy?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.groupAdmin?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStart = parsedStart ? groupStart >= parsedStart : true;
      const matchesEnd = parsedEnd ? groupEnd <= parsedEnd : true;
      const overlapsDate = parsedStart && parsedEnd
        ? groupStart <= parsedEnd && groupEnd >= parsedStart
        : true;

      return matchesEmail && matchesStart && matchesEnd && overlapsDate;
    });

    setFilteredGroups(result);
  }, [searchQuery, startDate, endDate, data.groups]);

  const resetFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setFilteredGroups(data.groups);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text('Group Statistics Report', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
    doc.text(`Total Groups: ${filteredGroups.length}`, 105, 40, { align: 'center' });

    const tableData = filteredGroups.map(group => [
      group.title,
      group.location,
      new Date(group.startDateTime).toLocaleString(),
      new Date(group.endDateTime).toLocaleString(),
      group.currentMembers,
      group.createdBy.email,
      group.groupAdmin.email
    ]);

    autoTable(doc, {
      head: [['Title', 'Location', 'Start Time', 'End Time', 'Members', 'Creator Email', 'Admin Email']],
      body: tableData,
      startY: 50,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 15 },
        5: { cellWidth: 40 },
        6: { cellWidth: 40 }
      }
    });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('© 2023 Your Company Name', 105, doc.internal.pageSize.height - 10, { align: 'center' });

    doc.save('group-statistics-report.pdf');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-3 py-1 bg-gray-200 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Group Administration</h1>
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Export to PDF
        </button>
      </div>

      {/* Search and Filter Inputs */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <input
          type="text"
          placeholder="Search by Email"
          className="border border-gray-300 rounded p-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="date"
          className="border border-gray-300 rounded p-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border border-gray-300 rounded p-2"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Group Statistics</h2>
        <p className="text-lg">
          Total groups: <span className="font-bold">{filteredGroups.length}</span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creator Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin Email</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGroups.map((group, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-900">{group.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{group.location}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(group.startDateTime).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(group.endDateTime).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{group.currentMembers}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{group.createdBy.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{group.groupAdmin.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupAdminPage;