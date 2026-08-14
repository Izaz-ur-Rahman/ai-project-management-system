const Project = require("../models/Project");   
const mongoose = require("mongoose");
const createProject = async (req, res) => {
    try {
        const {
            name,
            description,
            status,
            priority,
            startDate,
            dueDate,
        } = req.body;

        // Validate required field
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project name is required",
            });
        }

        // Validate date range
        if (
            startDate &&
            dueDate &&
            new Date(dueDate) < new Date(startDate)
        ) {
            return res.status(400).json({
                success: false,
                message: "Due date cannot be earlier than start date",
            });
        }

        const project = await Project.create({
            name: name.trim(),
            description: description?.trim(),
            owner: req.user._id,
            status,
            priority,
            startDate,
            dueDate,
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: {
                project,
            },
        });
    } catch (error) {
        console.error("Create project error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// get projects for the logged-in user, including projects they own and projects they are a member of
const getProjects = async (req, res) => {
    try {
        const userId = req.user._id;

        const projects = await Project.find({
            $or: [
                { owner: userId },
                { members: userId },
            ],
        })
            .populate("owner", "name email")
            .populate("members", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Projects retrieved successfully",
            data: {
                projects,
                count: projects.length,
            },
        });
    } catch (error) {
        console.error("Get projects error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// get a single project by ID, ensuring the logged-in user is either the owner or a member of the project
const getProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        const userId = req.user._id;

        const project = await Project.findOne({
            _id: id,
            $or: [
                { owner: userId },
                { members: userId },
            ],
        })
            .populate("owner", "name email")
            .populate("members", "name email");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project retrieved successfully",
            data: {
                project,
            },
        });
    } catch (error) {
        console.error("Get project error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// update a project by ID, ensuring the logged-in user is the owner of the project
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        const {
            name,
            description,
            status,
            priority,
            startDate,
            dueDate,
        } = req.body;

        // Find project owned by current user
        const project = await Project.findOne({
            _id: id,
            owner: req.user._id,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // Validate name if provided
        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Project name cannot be empty",
                });
            }

            project.name = name.trim();
        }

        // Update optional fields
        if (description !== undefined) {
            project.description = description.trim();
        }

        if (status !== undefined) {
            project.status = status;
        }

        if (priority !== undefined) {
            project.priority = priority;
        }

        if (startDate !== undefined) {
            project.startDate = startDate;
        }

        if (dueDate !== undefined) {
            project.dueDate = dueDate;
        }

        // Validate date range
        if (
            project.startDate &&
            project.dueDate &&
            new Date(project.dueDate) < new Date(project.startDate)
        ) {
            return res.status(400).json({
                success: false,
                message: "Due date cannot be earlier than start date",
            });
        }

        await project.save();

        const updatedProject = await Project.findById(project._id)
            .populate("owner", "name email")
            .populate("members", "name email");

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: {
                project: updatedProject,
            },
        });
    } catch (error) {
        console.error("Update project error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        // Only project owner can delete
        const project = await Project.findOne({
            _id: id,
            owner: req.user._id,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        await Project.deleteOne({
            _id: project._id,
        });

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete project error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};