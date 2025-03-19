import { useState } from "react";
import { FiHome, FiSearch, FiSend, FiBarChart2, FiMenu, FiX } from "react-icons/fi";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      backgroundColor: "#f3f4f6",
    },
    sidebar: {
      width: "250px",
      height: "100vh",
      backgroundColor: "#111827",
      color: "#fff",
      padding: "20px",
      position: "fixed",
      transition: "transform 0.3s ease-in-out",
      transform: isSidebarOpen ? "translateX(0)" : "translateX(-250px)",
    },
    sidebarItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "0.3s",
    },
    active: {
      backgroundColor: "#374151",
    },
    content: {
      marginLeft: isSidebarOpen ? "300px" : "0", // Adjust margin based on sidebar state
      padding: "20px",
      transition: "margin-left 0.3s",
      flex: 1,
    },
    mobileHeader: {
      backgroundColor: "#fff",
      padding: "15px",
      boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "fixed",
      width: "100%",
      top: 0,
      zIndex: 1000,
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>Admin Panel</h1>
          <button onClick={() => setSidebarOpen(false)} style={{ display: "none" }}>
            <FiX size={24} />
          </button>
        </div>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {[
            { name: "Dashboard", icon: <FiHome />, section: "Dashboard" },
            { name: "Search", icon: <FiSearch />, section: "Search" },
            { name: "Broadcast Message", icon: <FiSend />, section: "Broadcast Message" },
            { name: "Report", icon: <FiBarChart2 />, section: "Report" },
          ].map((item, index) => (
            <li
              key={index}
              style={{
                ...styles.sidebarItem,
                ...(active === item.section ? styles.active : {}),
              }}
              onClick={() => setActive(item.section)}
            >
              {item.icon}
              <span style={{ marginLeft: "10px" }}>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Mobile Header */}
        <div style={{ ...styles.mobileHeader, display: "none" }}>
          <button onClick={() => setSidebarOpen(true)}>
            <FiMenu size={24} />
          </button>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>{active}</h2>
          <div></div>
        </div>

        {/* Page Content */}
        <div style={{ paddingTop: "60px" }}>
          {active === "Dashboard" && <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Welcome to the Dashboard</h2>}
          {active === "Search" && <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Search Section</h2>}
          {active === "Broadcast Message" && <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Send Broadcast Messages</h2>}
          {active === "Report" && <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Reports & Analytics</h2>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
