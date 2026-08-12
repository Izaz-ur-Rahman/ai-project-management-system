const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./authRoutes");
const authorize = require("../middleware/roleMiddleware");
const authenticate = require("../middleware/authMiddleware");
const projectRoutes = require("./projectRoutes");
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
router.use("/projects", projectRoutes);

module.exports = router;