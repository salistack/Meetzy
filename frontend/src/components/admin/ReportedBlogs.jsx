import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Ensure autoTable is imported

const ReportedBlogs = () => {
  const [reportedBlogs, setReportedBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportedBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reports");
        setReportedBlogs(response.data);
        setFilteredBlogs(response.data);
      } catch (error) {
        console.error("Error fetching reported blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportedBlogs();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterStatus(value);

    if (value === "all") {
      setFilteredBlogs(reportedBlogs);
    } else {
      const filtered = reportedBlogs.filter((r) => r.status === value);
      setFilteredBlogs(filtered);
    }
  };

  const generatePDF = () => {
    try {
      if (!filteredBlogs || filteredBlogs.length === 0) {
        alert("No data available to generate the PDF.");
        return;
      }

      const doc = new jsPDF();
      doc.text("Reported Blogs Report", 14, 16);

      // Debugging log to inspect data
      console.log("Generating PDF with data:", filteredBlogs);

      const rows = filteredBlogs.map((report, index) => [
        index + 1,
        report.blogId?.title || "Blog not found",
        report.reportedBy || "Unknown",
        report.category || "Uncategorized",
        report.status || "Unknown",
        report.createdAt ? new Date(report.createdAt).toLocaleString() : "Unknown",
        report.actionTaken || "N/A",
      ]);

      autoTable(doc, {
        head: [["#", "Blog Title", "Reported By", "Category", "Status", "Reported At", "Action Taken"]],
        body: rows,
        startY: 20,
      });

      doc.save("reported_blogs_report.pdf");
      alert("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please check the console for more details.");
    }
  };

  const handleAction = async (reportId, action) => {
    try {
      if (action === "view") {
        const report = reportedBlogs.find((r) => r._id === reportId);
        if (report) {
          navigate(`/blog/${report.blogId._id}`);
        }
        return;
      }

      if (action === "ignore") {
        await axios.put(`http://localhost:5000/api/reports/${reportId}`, {
          status: "ignored",
          actionTaken: "Report ignored by admin",
        });
      } else if (action === "delete") {
        await axios.delete(`http://localhost:5000/api/reports/${reportId}`);
      } else if (action === "delete-blog") {
        const report = reportedBlogs.find((r) => r._id === reportId);
        if (report) {
          await axios.delete(`http://localhost:5000/api/blogs/${report.blogId._id}`);
          await axios.put(`http://localhost:5000/api/reports/${reportId}`, {
            status: "action_taken",
            actionTaken: "Blog deleted by admin",
          });
        }
      }

      const updatedReports = await axios.get("http://localhost:5000/api/reports");
      setReportedBlogs(updatedReports.data);
      setFilterStatus("all");
      setFilteredBlogs(updatedReports.data);

      alert("Action completed successfully");
    } catch (error) {
      console.error("Error performing action:", error);
      alert("Failed to perform action");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Reported Blogs
      </h1>

      {/* Filter and Download */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <label className="mr-2 font-medium text-gray-700">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="ignored">Ignored</option>
            <option value="action_taken">Action Taken</option>
          </select>
        </div>

        <button
          onClick={generatePDF}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
        >
          Download PDF Report
        </button>
      </div>

      {filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-600">No reported blogs found.</p>
      ) : (
        <div className="grid gap-6">
          {filteredBlogs.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {report.blogId?.photo && (
                  <div className="md:w-1/4">
                    <img
                      src={`http://localhost:5000${report.blogId.photo}`}
                      alt={report.blogId.title}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}
                <div className="md:w-3/4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold mb-2 text-gray-800">
                      {report.blogId ? report.blogId.title : "Blog not found"}
                    </h2>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        report.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : report.status === "ignored"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {report.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {report.blogId
                      ? report.blogId.description.substring(0, 200)
                      : "No description available"}...
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Reported By:</span> {report.reportedBy}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Category:</span>{" "}
                        <span className="capitalize">{report.category}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Reported At:</span>{" "}
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                      {report.actionTaken && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Action Taken:</span> {report.actionTaken}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => handleAction(report._id, "view")}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm"
                    >
                      View Blog
                    </button>
                    <button
                      onClick={() => handleAction(report._id, "ignore")}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Ignore Report
                    </button>
                    <button
                      onClick={() => handleAction(report._id, "delete")}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Delete Report
                    </button>
                    <button
                      onClick={() => handleAction(report._id, "delete-blog")}
                      className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded text-sm"
                    >
                      Delete Blog
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportedBlogs;
