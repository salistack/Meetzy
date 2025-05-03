const Group = require("../models/GroupModel");

const adminOnly = async (req, res, next) => {
  try {
    const groupId = req.params.id; // <-- changed from req.params.groupId
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is the group admin
    if (group.groupAdmin.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the group admin can perform this action" });
    }

    next(); // user is group admin, allow access
  } catch (error) {
    console.error("Group Admin Check Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { adminOnly };
