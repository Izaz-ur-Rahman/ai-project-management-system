const Project = require("../models/Project");   

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

const getProjects = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Get projects endpoint not implemented yet",
    });
};

const getProject = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Get project endpoint not implemented yet",
    });
};

const updateProject = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Update project endpoint not implemented yet",
    });
};

const deleteProject = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Delete project endpoint not implemented yet",
    });
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};