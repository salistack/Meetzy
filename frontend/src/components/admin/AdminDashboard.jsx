import { useState } from "react";
import { FiHome, FiSearch, FiSend, FiBarChart2, FiMenu, FiX } from "react-icons/fi";
import Broadcast from "./Broadcast";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed h-full bg-gray-900 text-white w-64 p-5 transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <FiX size={24} />
          </button>
        </div>

        <ul className="space-y-4">
          {[{ name: "Dashboard", icon: <FiHome />, section: "Dashboard" },
            { name: "Search", icon: <FiSearch />, section: "Search" },
            { name: "Broadcast Message", icon: <FiSend />, section: "Broadcast Message" },
            { name: "Report", icon: <FiBarChart2 />, section: "Report" }
          ].map((item, index) => (
            <li
              key={index}
              className={`flex items-center p-3 rounded-md cursor-pointer transition ${active === item.section ? "bg-gray-700" : "hover:bg-gray-800"}`}
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
          <button onClick={() => setSidebarOpen(true)}>
            <FiMenu size={24} />
          </button>
          <h2 className="text-lg font-bold">{active}</h2>
          <div></div>
        </div>

        {/* Page Content */}
        <div className="p-6 pt-20 lg:pt-6">
          {active === "Dashboard" && <h2 className="text-2xl font-bold">Welcome to the Dashboard</h2>}
          {active === "Search" && <h2 className="text-2xl font-bold">Search Section</h2>}
          {active === "Broadcast Message" && <Broadcast />}
          {active === "Report" && <h2 className="text-2xl font-bold">Reports & Analytics</h2>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
