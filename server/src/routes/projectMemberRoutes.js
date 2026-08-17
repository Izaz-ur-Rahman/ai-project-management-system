const express = require("express");

const {
    addMember,
    getMembers,
    removeMember,
} = require("../controllers/projectMemberController");

const authenticate = require("../middleware/authMiddleware");

const {
    authorizeProjectOwner,
    authorizeProjectMember,
} = require("../middleware/projectAuthorization");


const router = express.Router();


/**
 * Add project member
 * Owner only
 */
router.post(
    "/:id/members",
    authenticate,
    authorizeProjectOwner,
    addMember
);


/**
 * Get project members
 * Owner or project member
 */
router.get(
    "/:id/members",
    authenticate,
    authorizeProjectMember,
    getMembers
);


/**
 * Remove project member
 * Owner only
 */
router.delete(
    "/:id/members/:userId",
    authenticate,
    authorizeProjectOwner,
    removeMember
);


module.exports = router;