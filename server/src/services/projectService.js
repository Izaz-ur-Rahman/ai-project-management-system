const mongoose = require("mongoose");
const Project = require("../models/Project");

const createProject = async ({
    name,
    description,
    status,
    priority,
    startDate,
    dueDate,
    ownerId,
}) => {
    if (!name || !name.trim()) {
        const error = new Error("Project name is required");
        error.statusCode = 400;
        throw error;
    }

    if (
        startDate &&
        dueDate &&
        new Date(dueDate) < new Date(startDate)
    ) {
        const error = new Error(
            "Due date cannot be earlier than start date"
        );
        error.statusCode = 400;
        throw error;
    }

    const project = await Project.create({
        name: name.trim(),
        description: description?.trim(),
        owner: ownerId,
        status,
        priority,
        startDate,
        dueDate,
    });

    return project;
};


const getProjects = async (userId) => {
    const projects = await Project.find({
        isDeleted: false,
        $or: [
            { owner: userId },
            { members: userId },
        ],
    })
        .populate("owner", "name email")
        .populate("members", "name email")
        .sort({ createdAt: -1 });

    return projects;
};


const getProjectById = async (projectId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        const error = new Error("Invalid project ID");
        error.statusCode = 400;
        throw error;
    }

    const project = await Project.findOne({
        _id: projectId,
        isDeleted: false,
        $or: [
            { owner: userId },
            { members: userId },
        ],
    })
        .populate("owner", "name email")
        .populate("members", "name email");

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    return project;
};


const updateProject = async (project, data) => {
    const {
        name,
        description,
        status,
        priority,
        startDate,
        dueDate,
    } = data;

    if (name !== undefined) {
        if (!name.trim()) {
            const error = new Error(
                "Project name cannot be empty"
            );
            error.statusCode = 400;
            throw error;
        }

        project.name = name.trim();
    }

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

    if (
        project.startDate &&
        project.dueDate &&
        new Date(project.dueDate) <
            new Date(project.startDate)
    ) {
        const error = new Error(
            "Due date cannot be earlier than start date"
        );
        error.statusCode = 400;
        throw error;
    }

    await project.save();

    return await Project.findById(project._id)
        .populate("owner", "name email")
        .populate("members", "name email");
};


const deleteProject = async (project) => {
    project.isDeleted = true;
    project.deletedAt = new Date();

    await project.save();

    return project;
};


module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
};