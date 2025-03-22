import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './CreateProfile.css';  // Link to the CSS file

const CreateProfile = () => {
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

  const [error, setError] = useState("");  // New state for error handling
  const [formErrors, setFormErrors] = useState({});  // To store form validation errors
  const navigate = useNavigate();

  // Input change handler
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^[0-9]{10}$/;  // Simple phone number validation (10 digits)

    // Required field validation
    if (!user.name) errors.name = "Name is required";
    if (!user.fullName) errors.fullName = "Full Name is required";
    if (!user.dob) errors.dob = "Date of Birth is required";
    if (!user.nic) errors.nic = "NIC is required";
    if (!user.address) errors.address = "Address is required";
    if (!user.phoneNumber) errors.phoneNumber = "Phone Number is required";

    // Phone number format validation
    if (user.phoneNumber && !phoneRegex.test(user.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }

    // Date of birth validation (must not be in the future)
    if (user.dob && new Date(user.dob) > new Date()) {
      errors.dob = "Date of Birth cannot be in the future";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;  // If no errors, return true
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Clear any previous errors before trying again
    if (!validateForm()) {
      return;  // Prevent form submission if validation fails
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users", user);
      navigate(`/profile/${response.data._id}`);
    } catch (error) {
      // Detailed error logging for debugging
      console.error("Error creating profile:", error.response ? error.response.data : error.message);
      
      // Set the error message to display to the user
      setError("An error occurred while creating the profile. Please try again later.");
    }
  };

  return (
    <div className="container">
      <h2>Create Profile</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="profile-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
          required
        />
        {formErrors.name && <div className="error">{formErrors.name}</div>}

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={user.fullName}
          onChange={handleChange}
          required
        />
        {formErrors.fullName && <div className="error">{formErrors.fullName}</div>}

        <input
          type="date"
          name="dob"
          value={user.dob}
          onChange={handleChange}
          required
        />
        {formErrors.dob && <div className="error">{formErrors.dob}</div>}

        <input
          type="text"
          name="nic"
          placeholder="NIC"
          value={user.nic}
          onChange={handleChange}
          required
        />
        {formErrors.nic && <div className="error">{formErrors.nic}</div>}

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={user.address}
          onChange={handleChange}
          required
        />
        {formErrors.address && <div className="error">{formErrors.address}</div>}

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={user.phoneNumber}
          onChange={handleChange}
          required
        />
        {formErrors.phoneNumber && <div className="error">{formErrors.phoneNumber}</div>}

        <input
          type="text"
          name="interest"
          placeholder="Interests"
          value={user.interest}
          onChange={handleChange}
        />

        <select name="maritalStatus" value={user.maritalStatus} onChange={handleChange}>
          <option>Single</option>
          <option>Married</option>
          <option>Divorced</option>
          <option>Widowed</option>
        </select>

        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
};

export default CreateProfile;
