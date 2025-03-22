import { useState } from "react";
import { FiHome, FiSearch, FiSend, FiBarChart2, FiMenu, FiX } from "react-icons/fi";
import Broadcast from "./Broadcast";
import { useNavigate } from "react-router-dom";
import ReportedBlogs from "./ReportedBlogs";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/"); // Navigate to home
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`fixed h-full bg-gray-800 text-white w-64 p-5 transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <FiX size={24} />
          </button>
        </div>

        <ul className="space-y-4">
          {[{ name: "Dashboard", icon: <FiHome />, section: "Dashboard" },
            { name: "Search", icon: <FiSearch />, section: "Search" },
            { name: "Broadcast Message", icon: <FiSend />, section: "Broadcast Message" },
            { name: "Reported blogs", icon: <FiBarChart2 />, section: "Reported blogs" }
          ].map((item, index) => (
            <li
              key={index}
              className={`flex items-center p-3 rounded-md cursor-pointer transition ${active === item.section ? "bg-gray-700" : "hover:bg-gray-700"}`}
              onClick={() => setActive(item.section)}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Mobile Header */}
        <div className="bg-white p-4 shadow-md flex justify-between items-center lg:hidden fixed w-full top-0 z-50">
          <button onClick={() => setSidebarOpen(true)} className="text-indigo-500 hover:text-indigo-700">
            <FiMenu size={24} />
          </button>
          <h2 className="text-lg font-bold">{active}</h2>
          <button onClick={handleSignOut} className="text-red-500 font-bold hover:text-red-700">
            Sign Out
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6 pt-20 lg:pt-6">
          {/* Desktop Header */}
          <div className="hidden lg:flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{active}</h2>
            <button onClick={handleSignOut} className="text-red-500 font-bold hover:text-red-700">
              Sign Out
            </button>
          </div>
          {active === "Dashboard" && <h2 className="text-2xl font-bold text-black">Welcome to the Dashboard</h2>}
          {active === "Search" && <h2 className="text-2xl font-bold text-black">Search Section</h2>}
          {active === "Broadcast Message" && <Broadcast />}
          {active === "Reported blogs" && <ReportedBlogs />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
