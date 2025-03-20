const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    nic: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    website: { type: String },
    allInfo: { type: String }, // Optional field for extra info
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
