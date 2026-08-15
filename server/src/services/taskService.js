const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/Project");


/**
 * Create a new task
 */
const createTask = async ({
    title,
    description,
    projectId,
    assignedTo,
    status,
    priority,
    dueDate,
    createdBy,
}) => {
    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        const error = new Error("Invalid project ID");
        error.statusCode = 400;
        throw error;
    }

    // Find active project
    const project = await Project.findOne({
        _id: projectId,
        isDeleted: false,
        $or: [
            { owner: createdBy },
            { members: createdBy },
        ],
    });

    if (!project) {
        const error = new Error(
            "Project not found or you do not have access to this project"
        );

        error.statusCode = 404;
        throw error;
    }

    // Validate assigned user if provided
    if (assignedTo) {
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            const error = new Error("Invalid assigned user ID");
            error.statusCode = 400;
            throw error;
        }

        const isProjectMember =
            project.owner.toString() === assignedTo.toString() ||
            project.members.some(
                (memberId) =>
                    memberId.toString() === assignedTo.toString()
            );

        if (!isProjectMember) {
            const error = new Error(
                "Assigned user must be a member of the project"
            );

            error.statusCode = 400;
            throw error;
        }
    }

    // Validate task due date against project dates
    if (
        dueDate &&
        project.startDate &&
        new Date(dueDate) < new Date(project.startDate)
    ) {
        const error = new Error(
            "Task due date cannot be earlier than project start date"
        );

        error.statusCode = 400;
        throw error;
    }

    const task = await Task.create({
        title: title?.trim(),
        description: description?.trim(),
        project: projectId,
        assignedTo: assignedTo || null,
        createdBy,
        status,
        priority,
        dueDate,
    });

    return await Task.findById(task._id)
        .populate("project", "name status priority")
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");
};


/**
 * Get tasks accessible to the authenticated user
 */
const getTasks = async (userId) => {
    const tasks = await Task.find({
        isDeleted: false,
        $or: [
            { createdBy: userId },
            { assignedTo: userId },
        ],
    })
        .populate("project", "name status priority")
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

    return tasks;
};


/**
 * Get a single task accessible to the authenticated user
 */
const getTaskById = async (taskId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        const error = new Error("Invalid task ID");
        error.statusCode = 400;
        throw error;
    }

    const task = await Task.findOne({
        _id: taskId,
        isDeleted: false,
        $or: [
            { createdBy: userId },
            { assignedTo: userId },
        ],
    })
        .populate("project", "name status priority")
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");

    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    return task;
};


/**
 * Update a task
 */
const updateTask = async (task, data) => {
    const {
        title,
        description,
        status,
        priority,
        dueDate,
    } = data;

    if (title !== undefined) {
        if (!title.trim()) {
            const error = new Error(
                "Task title cannot be empty"
            );

            error.statusCode = 400;
            throw error;
        }

        task.title = title.trim();
    }

    if (description !== undefined) {
        task.description = description.trim();
    }

    if (status !== undefined) {
        task.status = status;
    }

    if (priority !== undefined) {
        task.priority = priority;
    }

    if (dueDate !== undefined) {
        task.dueDate = dueDate;
    }

    // Validate task due date
    if (task.dueDate) {
        const project = await Project.findOne({
            _id: task.project,
            isDeleted: false,
        });

        if (
            project &&
            project.startDate &&
            new Date(task.dueDate) <
                new Date(project.startDate)
        ) {
            const error = new Error(
                "Task due date cannot be earlier than project start date"
            );

            error.statusCode = 400;
            throw error;
        }
    }

    await task.save();

    return await Task.findById(task._id)
        .populate("project", "name status priority")
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");
};


/**
 * Soft delete a task
 */
const deleteTask = async (task) => {
    task.isDeleted = true;
    task.deletedAt = new Date();

    await task.save();

    return task;
};


module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
};