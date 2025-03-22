const { body, param, validationResult } = require("express-validator");
const Group = require("../models/GroupModel");
const path = require("path");

// Middleware for request validation
const validateGroup = [
    body("title").notEmpty().withMessage("Title is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("startDateTime").isISO8601().withMessage("Invalid start date"),
    body("endDateTime").isISO8601().withMessage("Invalid end date"),
    body("description").optional().isLength({ max: 500 }).withMessage("Description must be under 500 characters"),
    body("isLimited").isBoolean().withMessage("isLimited must be a boolean").optional(),
    body("numMembers")
        .if(body("isLimited").equals("true"))
        .isInt({ min: 1 })
        .withMessage("numMembers must be a positive integer when group is limited"),
];

// Middleware for checking request parameters (ID validation)
const validateId = [
    param("id").isMongoId().withMessage("Invalid ID format"),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Create Group
const createGroup = async (req, res) => {
    try {
        const { title, location, startDateTime, endDateTime, description, isLimited, numMembers } = req.body;
        const image = req.file ? `/uploads/groupUploads/${req.file.filename}` : null;

        if (isLimited && !numMembers) {
            return res.status(400).json({ message: "Please provide the maximum number of members when the group is limited." });
        }

        const newGroup = new Group({
            title,
            location,
            startDateTime,
            endDateTime,
            description,
            image,
            isLimited: isLimited || false,
            numMembers: isLimited ? numMembers : 0,
            currentMembers: 0,
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
        if (req.file) updatedData.image = `/uploads/groupUploads/${req.file.filename}`;

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

        if (group.isLimited && group.currentMembers >= group.numMembers) {
            return res.status(400).json({ message: "This group is full." });
        }

        group.currentMembers += 1;
        await group.save();

        res.status(200).json({ message: "Joined group successfully", group });
    } catch (error) {
        res.status(500).json({ message: "Error joining group", error });
    }
};

// Export with validation middleware
module.exports = {
    createGroup: [validateGroup, handleValidationErrors, createGroup],
    getAllGroups,
    getGroupById: [validateId, handleValidationErrors, getGroupById],
    updateGroup: [validateId, validateGroup, handleValidationErrors, updateGroup],
    deleteGroup: [validateId, handleValidationErrors, deleteGroup],
    joinGroup: [validateId, handleValidationErrors, joinGroup],
};
