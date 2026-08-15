const projectService = require("../services/projectService");


const createProject = async (req, res) => {
    try {
        const project = await projectService.createProject({
            ...req.body,
            ownerId: req.user._id,
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

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Internal server error",
        });
    }
};


const getProjects = async (req, res) => {
    try {
        const projects = await projectService.getProjects(
            req.user._id
        );

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

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Internal server error",
        });
    }
};


const getProject = async (req, res) => {
    try {
        const project = await projectService.getProjectById(
            req.params.id,
            req.user._id
        );

        return res.status(200).json({
            success: true,
            message: "Project retrieved successfully",
            data: {
                project,
            },
        });
    } catch (error) {
        console.error("Get project error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Internal server error",
        });
    }
};


const updateProject = async (req, res) => {
    try {
        const updatedProject =
            await projectService.updateProject(
                req.project,
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: {
                project: updatedProject,
            },
        });
    } catch (error) {
        console.error("Update project error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Internal server error",
        });
    }
};


const deleteProject = async (req, res) => {
    try {
        await projectService.deleteProject(req.project);

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete project error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Internal server error",
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