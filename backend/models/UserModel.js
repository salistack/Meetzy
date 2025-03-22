const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    nic: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    interest: { type: String },
    maritalStatus: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed'], // Enum of possible statuses
        required: false
      }
    
      
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
