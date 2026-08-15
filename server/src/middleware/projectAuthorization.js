const mongoose = require("mongoose");
const Project = require("../models/Project");

const authorizeProjectOwner = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate project ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        // Find an active project owned by the authenticated user
        const project = await Project.findOne({
            _id: id,
            owner: req.user._id,
            isDeleted: false,
        });

        // Project does not exist or user is not the owner
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // Attach authorized project to request
        req.project = project;

        next();
    } catch (error) {
        console.error("Project authorization error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    authorizeProjectOwner,
};