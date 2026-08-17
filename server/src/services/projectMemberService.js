const mongoose = require("mongoose");

const Project = require("../models/Project");
const User = require("../models/User");
const AppError = require("../utils/AppError");


/**
 * Add a member to a project
 */
const addMember = async (projectId, userId) => {
    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new AppError("Invalid project ID", 400);
    }

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
    }

    // Find active project
    const project = await Project.findOne({
        _id: projectId,
        isDeleted: false,
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    // Check whether user exists
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Check if user is already the owner
    if (project.owner.toString() === userId.toString()) {
        throw new AppError(
            "Project owner is already part of the project",
            400
        );
    }

    // Check if user is already a member
    const alreadyMember = project.members.some(
        (memberId) =>
            memberId.toString() === userId.toString()
    );

    if (alreadyMember) {
        throw new AppError(
            "User is already a member of this project",
            400
        );
    }

    // Add member
    project.members.push(userId);

    await project.save();

    // Return populated project members
    await project.populate([
        {
            path: "owner",
            select: "name email role",
        },
        {
            path: "members",
            select: "name email role",
        },
    ]);

    return project;
};


/**
 * Get project members
 */
const getMembers = async (projectId) => {
    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new AppError("Invalid project ID", 400);
    }

    const project = await Project.findOne({
        _id: projectId,
        isDeleted: false,
    })
        .populate("owner", "name email role")
        .populate("members", "name email role");

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    return {
        owner: project.owner,
        members: project.members,
    };
};


/**
 * Remove member from project
 */
const removeMember = async (projectId, userId) => {
    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new AppError("Invalid project ID", 400);
    }

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
    }

    const project = await Project.findOne({
        _id: projectId,
        isDeleted: false,
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    // Owner cannot be removed as a member
    if (project.owner.toString() === userId.toString()) {
        throw new AppError(
            "Project owner cannot be removed",
            400
        );
    }

    const memberIndex = project.members.findIndex(
        (memberId) =>
            memberId.toString() === userId.toString()
    );

    if (memberIndex === -1) {
        throw new AppError(
            "User is not a member of this project",
            404
        );
    }

    project.members.splice(memberIndex, 1);

    await project.save();

    return project;
};


module.exports = {
    addMember,
    getMembers,
    removeMember,
};