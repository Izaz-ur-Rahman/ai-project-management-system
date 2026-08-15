const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/Project");
const AppError = require("../utils/AppError");


/**
 * Authorize access to a task.
 *
 * A user can access a task if they are:
 * - The task creator
 * - The project owner
 * - A member of the project
 */
const authorizeTaskAccess = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid task ID", 400);
    }

    const task = await Task.findOne({
        _id: id,
        isDeleted: false,
    });

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const project = await Project.findOne({
        _id: task.project,
        isDeleted: false,
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const userId = req.user._id.toString();

    const isProjectOwner =
        project.owner.toString() === userId;

    const isProjectMember =
        project.members.some(
            (memberId) =>
                memberId.toString() === userId
        );

    const isTaskCreator =
        task.createdBy.toString() === userId;

    const hasAccess =
        isProjectOwner ||
        isProjectMember ||
        isTaskCreator;

    if (!hasAccess) {
        throw new AppError(
            "You do not have access to this task",
            403
        );
    }

    req.task = task;
    req.project = project;

    next();
};


/**
 * Authorize task modification.
 *
 * Only:
 * - Project owner
 * - Task creator
 */
const authorizeTaskOwnerOrCreator = async (
    req,
    res,
    next
) => {
    const task = req.task;
    const project = req.project;

    const userId = req.user._id.toString();

    const isProjectOwner =
        project.owner.toString() === userId;

    const isTaskCreator =
        task.createdBy.toString() === userId;

    if (!isProjectOwner && !isTaskCreator) {
        throw new AppError(
            "You are not authorized to modify this task",
            403
        );
    }

    next();
};


module.exports = {
    authorizeTaskAccess,
    authorizeTaskOwnerOrCreator,
};