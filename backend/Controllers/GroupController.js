const Group = require("../models/GroupModel");
const path = require("path");

// Create Group
const createGroup = async (req, res) => {
    try {
        const { title, location, startDateTime, endDateTime, description, isLimited, numMembers } = req.body;
        const image = req.file ? `/uploads/groupUploads/${req.file.filename}` : null; // Updated path

        // Check if `isLimited` is true and `numMembers` is provided
        if (isLimited && !numMembers) {
            return res.status(400).json({ message: "Please provide the maximum number of members when the group is limited." });
        }

        // Default currentMembers to 0 if the group is limited
        const newGroup = new Group({
            title,
            location,
            startDateTime,
            endDateTime,
            description,
            image,
            isLimited: isLimited || false, // Set the isLimited flag
            numMembers: isLimited ? numMembers : 0, // Set the numMembers if isLimited is true
            currentMembers: 0 // Initially, no members in the group
        });

        await newGroup.save();
        
        res.status(201).json({ message: "Group created successfully", group: newGroup });
    } catch (error) {
        res.status(500).json({ message: "Error creating group", error });
    }
};

// Get All Groups
const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving groups", error });
    }
};

// Get Single Group by ID
const getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: "Group not found" });
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving group", error });
    }
};

// Update Group by ID
const updateGroup = async (req, res) => {
    try {
        const updatedData = req.body;
        if (req.file) updatedData.image = `/uploads/groupUploads/${req.file.filename}`; // Updated path

        // If `isLimited` is updated, you may want to adjust `numMembers`
        if (updatedData.isLimited && updatedData.numMembers !== undefined) {
            if (updatedData.numMembers < updatedData.currentMembers) {
                return res.status(400).json({ message: "Cannot set a member limit less than the current number of members." });
            }
        }

        const updatedGroup = await Group.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedGroup) return res.status(404).json({ message: "Group not found" });

        res.status(200).json({ message: "Group updated successfully", group: updatedGroup });
    } catch (error) {
        res.status(500).json({ message: "Error updating group", error });
    }
};

// Delete Group by ID
const deleteGroup = async (req, res) => {
    try {
        const deletedGroup = await Group.findByIdAndDelete(req.params.id);
        if (!deletedGroup) return res.status(404).json({ message: "Group not found" });
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting group", error });
    }
};

// Join Group
const joinGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: "Group not found" });

        // Check if the group is limited and if the current members are equal to the maximum number
        if (group.isLimited && group.currentMembers >= group.numMembers) {
            return res.status(400).json({ message: "This group is full." });
        }

        // Add the user to the group
        group.currentMembers += 1; // Increase the current members count
        await group.save(); // Save the updated group data

        res.status(200).json({ message: "Joined group successfully", group });
    } catch (error) {
        res.status(500).json({ message: "Error joining group", error });
    }
};

module.exports = { createGroup, getAllGroups, getGroupById, updateGroup, deleteGroup, joinGroup };
