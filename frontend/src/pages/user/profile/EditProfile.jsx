import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfile.css";

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    fullName: "",
    dob: "",
    nic: "",
    address: "",
    phoneNumber: "",
    interest: "",
    maritalStatus: "Single",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`http://localhost:5000/api/users/${id}`);
      setUser(response.data);
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Validate name: Only letters and spaces allowed
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(user.name)) {
      alert("Name should only contain letters and spaces.");
      return false;
    }

    // Validate full name: Only letters and spaces allowed
    const fullNamePattern = /^[A-Za-z\s]+$/;
    if (!fullNamePattern.test(user.fullName)) {
      alert("Full Name should only contain letters and spaces.");
      return false;
    }

    // Validate NIC: 12 digits or 10 digits with a small or capital 'v' at the end
    const nicPattern = /^\d{12}$|^\d{10}[vV]$/;
    if (!nicPattern.test(user.nic)) {
      alert("NIC should be 12 digits or 10 digits followed by 'v' or 'V'.");
      return false;
    }

    // Validate phone number: Only 10 digits or a valid international number
    const phonePattern = /^(?:\+?\d{1,3})?[\d]{10}$/;
    if (!phonePattern.test(user.phoneNumber)) {
      alert("Phone number should be 10 digits or start with a '+' and include the country code.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    await axios.put(`http://localhost:5000/api/users/${id}`, user);
    navigate(`/profile/${id}`);
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={user.name || ""}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="fullName"
          value={user.fullName || ""}
          onChange={handleChange}
          placeholder="Full Name"
        />
        <input
          type="date"
          name="dob"
          value={user.dob || ""}
          onChange={handleChange}
          placeholder="Date of Birth"
        />
        <input
          type="text"
          name="nic"
          value={user.nic || ""}
          onChange={handleChange}
          placeholder="NIC"
        />
        <input
          type="text"
          name="address"
          value={user.address || ""}
          onChange={handleChange}
          placeholder="Address"
        />
        <input
          type="text"
          name="phoneNumber"
          value={user.phoneNumber || ""}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <input
          type="text"
          name="interest"
          value={user.interest || ""}
          onChange={handleChange}
          placeholder="Interests"
        />
        <select
          name="maritalStatus"
          value={user.maritalStatus || "Single"}
          onChange={handleChange}
        >
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditProfile;
