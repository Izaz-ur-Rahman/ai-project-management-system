const express = require("express");

const {
    authorizeProjectOwner,
} = require("../middleware/projectAuthorization");

const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();


router.post(
    "/",
    authenticate,
    createProject
);


router.get(
    "/",
    authenticate,
    getProjects
);


router.get(
    "/:id",
    authenticate,
    getProject
);


router.put(
    "/:id",
    authenticate,
    authorizeProjectOwner,
    updateProject
);


router.delete(
    "/:id",
    authenticate,
    authorizeProjectOwner,
    deleteProject
);


module.exports = router;