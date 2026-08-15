const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/Project");
const AppError = require("../utils/AppError");


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
        throw new AppError("Invalid project ID", 400);
    }

    // Find active project accessible to the user
    const project = await Project.findOne({
        _id: projectId,
        isDeleted: false,
        $or: [
            { owner: createdBy },
            { members: createdBy },
        ],
    });

    if (!project) {
        throw new AppError(
            "Project not found or you do not have access to this project",
            404
        );
    }

    // Validate assigned user
    if (assignedTo) {
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            throw new AppError(
                "Invalid assigned user ID",
                400
            );
        }

        const isProjectMember =
            project.owner.toString() === assignedTo.toString() ||
            project.members.some(
                (memberId) =>
                    memberId.toString() === assignedTo.toString()
            );

        if (!isProjectMember) {
            throw new AppError(
                "Assigned user must be a member of the project",
                400
            );
        }
    }

    // Validate task due date
    if (
        dueDate &&
        project.startDate &&
        new Date(dueDate) < new Date(project.startDate)
    ) {
        throw new AppError(
            "Task due date cannot be earlier than project start date",
            400
        );
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
        throw new AppError("Invalid task ID", 400);
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
        throw new AppError("Task not found", 404);
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
            throw new AppError(
                "Task title cannot be empty",
                400
            );
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
            throw new AppError(
                "Task due date cannot be earlier than project start date",
                400
            );
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