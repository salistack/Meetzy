const Group = require("../models/GroupModel");
const path = require("path");

// Create Group
const createGroup = async (req, res) => {
    try {
        const { title, location, startDateTime, endDateTime, description } = req.body;
        const image = req.file ? `/uploads/groupUploads/${req.file.filename}` : null; // Updated path

        const newGroup = new Group({ title, location, startDateTime, endDateTime, description, image });
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

module.exports = { createGroup, getAllGroups, getGroupById, updateGroup, deleteGroup };
