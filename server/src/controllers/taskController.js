const taskService = require("../services/taskService");


/**
 * Create a new task
 */
const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask({
            ...req.body,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: {
                task,
            },
        });
    } catch (error) {
        console.error("Create task error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Internal server error",
        });
    }
};


/**
 * Get tasks accessible to the authenticated user
 */
const getTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasks(
            req.user._id
        );

        return res.status(200).json({
            success: true,
            message: "Tasks retrieved successfully",
            data: {
                tasks,
                count: tasks.length,
            },
        });
    } catch (error) {
        console.error("Get tasks error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Internal server error",
        });
    }
};


/**
 * Get a single task by ID
 */
const getTask = async (req, res) => {
    try {
        const task = await taskService.getTaskById(
            req.params.id,
            req.user._id
        );

        return res.status(200).json({
            success: true,
            message: "Task retrieved successfully",
            data: {
                task,
            },
        });
    } catch (error) {
        console.error("Get task error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Internal server error",
        });
    }
};


/**
 * Update a task
 */
const updateTask = async (req, res) => {
    try {
        const updatedTask = await taskService.updateTask(
            req.task,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: {
                task: updatedTask,
            },
        });
    } catch (error) {
        console.error("Update task error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Internal server error",
        });
    }
};


/**
 * Soft delete a task
 */
const deleteTask = async (req, res) => {
    try {
        await taskService.deleteTask(req.task);

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Delete task error:", error);

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
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
};