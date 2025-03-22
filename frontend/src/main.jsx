import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import CreateProfile from "./pages/user/profile/CreateProfile.jsx";
import Profile from "./pages/user/profile/Profile.jsx";
import EditProfile from "./pages/user/profile/EditProfile.jsx";
import Blogs from "./pages/user/blogs/Blogs.jsx";
import BlogDetails from "./pages/user/blogs/BlogDetails.jsx";
import CreateBlog from "./pages/user/blogs/CreateBlog.jsx";
import EditBlog from "./pages/user/blogs/EditBlog.jsx"; 
import AdminDashboard from "./components/admin/AdminDashboard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
        <Route path="/user/blogs" element={<Blogs />} />
        <Route path="/user/blogs/:id" element={<BlogDetails />} />
        <Route path="/user/blogs/create" element={<CreateBlog />} />
        <Route path="/user/blogs/edit/:id" element={<EditBlog />} />
        <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  </StrictMode>
);
