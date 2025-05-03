const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  isLimited: { type: Boolean, default: false },
  numMembers: { type: Number, default: 0 },
  currentMembers: { type: Number, default: 0 },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
}, 
{ timestamps: true });

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
