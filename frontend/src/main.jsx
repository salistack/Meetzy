import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Blogs from "./pages/user/blogs/Blogs.jsx";
import BlogDetails from "./pages/user/blogs/BlogDetails.jsx";
import CreateBlog from "./pages/user/blogs/CreateBlog.jsx";
import EditBlog from "./pages/user/blogs/EditBlog.jsx"; 
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import GroupsPage from "./pages/user/groups/GroupPage.jsx"; // Group Listing Page
import CreateGroup from "./pages/user/groups/CreateGroup.jsx";
import GroupDetails from "./pages/user/groups/GroupDetails.jsx";
import UpdateGroup from "./pages/user/groups/UpdateGroup.jsx";
import './index.css';
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/user/blogs" element={<Blogs />} />
        <Route path="/user/blogs/:id" element={<BlogDetails />} />
        <Route path="/user/blogs/create" element={<CreateBlog />} />
        <Route path="/user/blogs/:id" element={<BlogDetails />} />
        <Route path="/user/blogs/edit/:id" element={<EditBlog />} />
        <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/user/groups" element={<GroupsPage />} />  {/* List Groups */}
        <Route path="/user/groups/create" element={<CreateGroup />} />  {/* Create Group */}
        <Route path="/user/groups/:id" element={<GroupDetails />} />  {/* Group Details */}
        <Route path="/user/groups/update/:id" element={<UpdateGroup />} /> 
        <Route path="/signup" element={<SignupPage />} /> 
        <Route path="/LoginPage" element={<LoginPage />} /> 

      </Routes>
    </Router>
  </StrictMode>
);
