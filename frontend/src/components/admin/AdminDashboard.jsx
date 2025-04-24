import { useState, useEffect } from "react";
import { 
  FiHome, 
  FiSearch, 
  FiSend, 
  FiBarChart2, 
  FiMenu, 
  FiX,
  FiUsers,
  FiFileText,
  FiPieChart
} from "react-icons/fi";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"; // Ensure this import is correct
import Broadcast from "./Broadcast";
import { useNavigate } from "react-router-dom";
import ReportedBlogs from "./ReportedBlogs";
import axios from "axios";
import { toast } from "react-toastify"; // Add toast notifications for better UX
import "react-toastify/dist/ReactToastify.css"; // Ensure the CSS is imported for proper styling

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    userRegistrations: [],
    blogPosts: [],
    totalUsers: 0,
    totalBlogs: 0,
    reportedBlogs: 0,
    activeGroups: 0,
    blogCategories: [], // Initialize blogCategories to an empty array
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (active === "Dashboard") {
      fetchDashboardData();
    }
  }, [active]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/stats'); // Replace mock data with API call
      console.log("API Response:", response.data); // Log the API response
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data. Please try again.");
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FiUsers size={24} />
              <div className="ml-4">
                <h3 className="text-sm font-medium">Total Users</h3>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FiFileText size={24} />
              <div className="ml-4">
                <h3 className="text-sm font-medium">Total Blogs</h3>
                <p className="text-2xl font-bold">{stats.totalBlogs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-700 text-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FiBarChart2 size={24} />
              <div className="ml-4">
                <h3 className="text-sm font-medium">Reported Blogs</h3>
                <p className="text-2xl font-bold">{stats.reportedBlogs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FiPieChart size={24} />
              <div className="ml-4">
                <h3 className="text-sm font-medium">Active Groups</h3>
                <p className="text-2xl font-bold">{stats.activeGroups}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Registrations Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">User Registrations (Last 3 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.userRegistrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4F46E5" name="Registrations" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Blog Posts Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Blog Posts (Last 3 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.blogPosts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#10B981" 
                name="Blog Posts"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Blog Categories Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Blog Categories Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.blogCategories || []} // Fallback to an empty array if undefined
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {(stats.blogCategories || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed h-full bg-gray-800 text-white w-64 p-5 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } z-10`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <FiX size={24} />
          </button>
        </div>

        <ul className="space-y-4">
          {[
            { name: "Dashboard", icon: <FiHome />, section: "Dashboard" },
            { name: "Search", icon: <FiSearch />, section: "Search" },
            { name: "Broadcast Message", icon: <FiSend />, section: "Broadcast Message" },
            { name: "Reported blogs", icon: <FiBarChart2 />, section: "Reported blogs" }
          ].map((item, index) => (
            <li
              key={index}
              className={`flex items-center p-3 rounded-md cursor-pointer transition ${
                active === item.section ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setActive(item.section)}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Mobile Header */}
        <div className="bg-white p-4 shadow-md flex justify-between items-center lg:hidden fixed w-full top-0 z-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-indigo-500 hover:text-indigo-700"
          >
            <FiMenu size={24} />
          </button>
          <h2 className="text-lg font-bold">{active}</h2>
          <button
            onClick={handleSignOut}
            className="text-red-500 font-bold hover:text-red-700"
          >
            Sign Out
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6 pt-20 lg:pt-6">
          {/* Desktop Header */}
          <div className="hidden lg:flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{active}</h2>
            <button
              onClick={handleSignOut}
              className="text-red-500 font-bold hover:text-red-700"
            >
              Sign Out
            </button>
          </div>

          {active === "Dashboard" && renderDashboard()}
          {active === "Search" && <h2 className="text-2xl font-bold text-black">Search Section</h2>}
          {active === "Broadcast Message" && <Broadcast />}
          {active === "Reported blogs" && <ReportedBlogs />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;