const Group = require("../models/GroupModel");
const User = require("../models/UserModel");
const fs = require("fs");
const path = require("path");

// Create Group
const createGroup = async (req, res) => {
    try {
        const { title, location, startDateTime, endDateTime, description, isLimited, numMembers } = req.body;
        const image = req.file ? `/uploads/groupUploads/${req.file.filename}` : null;

        const newGroup = new Group({
            title,
            location,
            startDateTime,
            endDateTime,
            description,
            image,
            isLimited: isLimited || false,
            numMembers: isLimited ? parseInt(numMembers) : 0,
            currentMembers: 1,
            createdBy: req.user._id,
            groupAdmin: req.user._id,
            members: [req.user._id],
        });

        const savedGroup = await newGroup.save();

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                groupsJoined: savedGroup._id,
                adminOfGroups: savedGroup._id,
                groupsCreated: savedGroup._id
            }
        });

        res.status(201).json(savedGroup);
    } catch (error) {
        res.status(500).json({ message: "Error creating group", error: error.message });
    }
};

// Get all groups
const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find()
            .populate("createdBy", "name")
            .populate("groupAdmin", "name");
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Error fetching groups", error: error.message });
    }
};

// Get group by ID
const getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate("members", "name")
            .populate("createdBy", "name")
            .populate("groupAdmin", "name");

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: "Error fetching group", error: error.message });
    }
};

// Update Group (only admin can update)
const updateGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.groupAdmin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only admin can update the group." });
        }

        if (req.body.title) group.title = req.body.title;
        if (req.body.location) group.location = req.body.location;
        if (req.body.startDateTime) group.startDateTime = req.body.startDateTime;
        if (req.body.endDateTime) group.endDateTime = req.body.endDateTime;
        if (req.body.description) group.description = req.body.description;
        if (req.body.isLimited !== undefined) group.isLimited = req.body.isLimited;
        if (req.body.numMembers !== undefined) group.numMembers = req.body.numMembers;

        if (req.file) {
            if (group.image) {
                const oldPath = path.join("uploads/groupUploads", group.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            group.image = req.file.filename;
        }

        await group.save();
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: "Error updating group", error: error.message });
    }
};

// Delete Group (only admin)
const deleteGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.groupAdmin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only admin can delete the group." });
        }

        if (group.image) {
            const imagePath = path.join("uploads/groupUploads", group.image);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        await User.updateMany(
            { groupsJoined: group._id },
            { $pull: { groupsJoined: group._id, adminOfGroups: group._id, groupsCreated: group._id } }
        );

        await group.deleteOne();
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting group", error: error.message });
    }
};

// Join Group
const joinGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.members.includes(req.user._id)) {
            return res.status(400).json({ message: "Already a member of the group" });
        }

        if (group.isLimited && group.currentMembers >= group.numMembers) {
            return res.status(400).json({ message: "Group is full" });
        }

        group.members.push(req.user._id);
        group.currentMembers += 1;
        await group.save();

        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { groupsJoined: group._id }
        });

        res.status(200).json({ message: "Joined group successfully", group });
    } catch (error) {
        res.status(500).json({ message: "Error joining group", error: error.message });
    }
};

// Leave Group (handles admin change)
const leaveGroup = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized. User not found." });
        }

        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (!group.members.includes(req.user._id)) {
            return res.status(400).json({ message: "You are not a member of this group." });
        }

        const isAdmin = group.groupAdmin.toString() === req.user._id.toString();

        group.members = group.members.filter(
            memberId => memberId.toString() !== req.user._id.toString()
        );

        if (group.currentMembers > 0) {
            group.currentMembers -= 1;
        }

        if (isAdmin && group.members.length > 0) {
            const newAdmin = group.members[0];
            group.groupAdmin = newAdmin;

            await User.findByIdAndUpdate(newAdmin, {
                $addToSet: { adminOfGroups: group._id }
            });

            await User.findByIdAndUpdate(req.user._id, {
                $pull: { adminOfGroups: group._id }
            });
        } else if (isAdmin) {
            group.groupAdmin = null;

            await User.findByIdAndUpdate(req.user._id, {
                $pull: { adminOfGroups: group._id }
            });
        }

        await group.save();

        await User.findByIdAndUpdate(req.user._id, {
            $pull: { groupsJoined: group._id }
        });

        res.status(200).json({ message: "Left group successfully", group });
    } catch (error) {
        res.status(500).json({ message: "Error leaving group", error: error.message });
    }
};

// Remove a Member (only admin)
const removeMember = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        const userIdToRemove = req.params.memberId;

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Ensure the user is a member of the group
        if (!group.members.includes(userIdToRemove)) {
            return res.status(400).json({ message: "User is not a member of the group" });
        }

        // Remove the user from the group's members list
        group.members = group.members.filter(id => id.toString() !== userIdToRemove);
        group.currentMembers = Math.max(0, group.currentMembers - 1);

        // If the removed user was the admin, reassign or nullify
        if (group.groupAdmin.toString() === userIdToRemove) {
            if (group.members.length > 0) {
                group.groupAdmin = group.members[0];
                await User.findByIdAndUpdate(group.members[0], {
                    $addToSet: { adminOfGroups: group._id }
                });
            } else {
                group.groupAdmin = null;
            }
        }

        // Update the removed user document
        await User.findByIdAndUpdate(userIdToRemove, {
            $pull: { groupsJoined: group._id, adminOfGroups: group._id }
        });

        // Save the updated group
        await group.save();

        res.status(200).json({ message: "Member removed successfully", group });
    } catch (error) {
        res.status(500).json({ message: "Error removing member", error: error.message });
    }
};

const getGroupCount = async (req, res) => {
    try {
      const groups = await Group.aggregate([
        // Lookup createdBy user
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdByUser"
          }
        },
        {
          $unwind: "$createdByUser"
        },
        // Lookup groupAdmin user
        {
          $lookup: {
            from: "users",
            localField: "groupAdmin",
            foreignField: "_id",
            as: "groupAdminUser"
          }
        },
        {
          $unwind: "$groupAdminUser"
        },
        // Project only required fields
        {
          $project: {
            _id: 0,
            title: 1,
            location: 1,
            startDateTime: 1,
            endDateTime: 1,
            currentMembers: 1,
            createdBy: {
              userId: "$createdByUser._id",
              username: "$createdByUser.username",
              email: "$createdByUser.email"
            },
            groupAdmin: {
              userId: "$groupAdminUser._id",
              username: "$groupAdminUser.username",
              email: "$groupAdminUser.email"
            }
          }
        },
        {
          $sort: { startDateTime: -1 } // You can change this sorting as needed
        }
      ]);
  
      const totalCount = groups.length;
  
      res.status(200).json({
        totalCount,
        groups
      });
  
    } catch (error) {
      console.error("Error fetching group count:", error);
      res.status(500).json({
        message: "Error fetching group count",
        error: error.message
      });
    }
  };
  

module.exports = {
    createGroup,
    getAllGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    removeMember,
    getGroupCount,  // Add this function to the exports
};