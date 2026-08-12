const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./authRoutes");
const authorize = require("../middleware/roleMiddleware");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/health", (req, res) => {
    const databaseStatus =
        mongoose.connection.readyState === 1
            ? "connected"
            : "disconnected";

    res.status(200).json({
        success: true,
        message: "API is healthy",
        database: databaseStatus,
    });
});
router.use("/auth", authRoutes);

router.get(
    "/admin-test",
    authenticate,
    authorize("admin"),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Admin access granted",
            data: {
                user: req.user.name,
                role: req.user.role,
            },
        });
    }
);
module.exports = router;