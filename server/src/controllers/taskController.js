const taskService = require("../services/taskService");

const createTask = async (req, res) => {
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
};

const getTasks = async (req, res) => {
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
};

const getTask = async (req, res) => {
    const task = await taskService.getTaskById(
        req.task
    );

    return res.status(200).json({
        success: true,
        message: "Task retrieved successfully",
        data: {
            task,
        },
    });
};

const updateTask = async (req, res) => {
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
};

const deleteTask = async (req, res) => {
    await taskService.deleteTask(req.task);

    return res.status(200).json({
        success: true,
        message: "Task deleted successfully",
    });
};

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
};