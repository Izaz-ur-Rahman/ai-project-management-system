const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./authRoutes");
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

module.exports = router;