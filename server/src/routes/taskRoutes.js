const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const {
    authorizeTaskAccess,
    authorizeTaskModification,
} = require("../middleware/taskAuthorization");

const asyncHandler = require("../utils/asyncHandler");

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} = require("../controllers/taskController");

const router = express.Router();


// Create task
router.post(
    "/",
    authenticate,
    asyncHandler(createTask)
);


// Get all accessible tasks
router.get(
    "/",
    authenticate,
    asyncHandler(getTasks)
);


// Get single task
router.get(
    "/:id",
    authenticate,
    asyncHandler(authorizeTaskAccess),
    asyncHandler(getTaskById)
);


// Update task
router.put(
    "/:id",
    authenticate,
    asyncHandler(authorizeTaskAccess),
    asyncHandler(authorizeTaskModification),
    asyncHandler(updateTask)
);


// Delete task
router.delete(
    "/:id",
    authenticate,
    asyncHandler(authorizeTaskAccess),
    asyncHandler(authorizeTaskModification),
    asyncHandler(deleteTask)
);


module.exports = router;