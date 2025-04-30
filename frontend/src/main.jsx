import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Blogs from "./pages/user/blogs/Blogs.jsx";
import BlogDetails from "./pages/user/blogs/BlogDetails.jsx";
import CreateBlog from "./pages/user/blogs/CreateBlog.jsx";
import EditBlog from "./pages/user/blogs/EditBlog.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import GroupsPage from "./pages/user/groups/GroupPage.jsx";
import CreateGroup from "./pages/user/groups/CreateGroup.jsx";
import GroupDetails from "./pages/user/groups/GroupDetails.jsx";
import UpdateGroup from "./pages/user/groups/UpdateGroup.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import CreateFeed from "./pages/user/feed/CreateFeed.jsx";
import FeedList from "./pages/user/feed/FeedList.jsx";
import EditFeed from "./pages/user/feed/EditFeed.jsx";
import Profile from "./Profile";
import UserDetails from "./pages/userDetails.jsx"; // Import UserDetails here
import './index.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/user/blogs" element={<Blogs />} />
        <Route path="/user/blogs/create" element={<CreateBlog />} />
        <Route path="/user/blogs/:id" element={<BlogDetails />} />
        <Route path="/user/blogs/edit/:id" element={<EditBlog />} />
        <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/user/groups" element={<GroupsPage />} />
        <Route path="/user/groups/create" element={<CreateGroup />} />
        <Route path="/user/groups/:id" element={<GroupDetails />} />
        <Route path="/user/groups/update/:id" element={<UpdateGroup />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/user/feeds" element={<FeedList />} />
        <Route path="/user/feeds/create" element={<CreateFeed />} />
        <Route path="/user/feeds/edit/:id" element={<EditFeed />} />
        <Route path="/profile" element={<Profile />} />

        {/* Updated route for UserDetails page */}
        <Route path="/user/userDetails" element={<UserDetails />} />
      </Routes>
    </Router>
  </StrictMode>
);
