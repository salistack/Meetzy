const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Store image path
    isLimited: { type: Boolean, default: false }, // Whether the group has a member limit
    numMembers: { type: Number, default: 0 }, // The maximum number of members allowed
    currentMembers: { type: Number, default: 0 }, // Current number of members in the group
}, { timestamps: true });

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
