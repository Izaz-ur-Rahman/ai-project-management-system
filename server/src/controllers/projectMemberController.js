const projectMemberService = require("../services/projectMemberService");


/**
 * Add a member to a project
 */
const addMember = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    const project = await projectMemberService.addMember(
        id,
        userId
    );

    return res.status(200).json({
        success: true,
        message: "Project member added successfully",
        data: {
            project,
        },
    });
};


/**
 * Get project members
 */
const getMembers = async (req, res) => {
    const { id } = req.params;

    const members = await projectMemberService.getMembers(id);

    return res.status(200).json({
        success: true,
        message: "Project members retrieved successfully",
        data: members,
    });
};


/**
 * Remove a member from a project
 */
const removeMember = async (req, res) => {
    const { id, userId } = req.params;

    await projectMemberService.removeMember(
        id,
        userId
    );

    return res.status(200).json({
        success: true,
        message: "Project member removed successfully",
    });
};


module.exports = {
    addMember,
    getMembers,
    removeMember,
};