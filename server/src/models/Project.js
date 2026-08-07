const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
            minlength: [3, "Project name must be at least 3 characters"],
            maxlength: [150, "Project name cannot exceed 150 characters"],
        },

        description: {
            type: String,
            trim: true,
            maxlength: [
                2000,
                "Project description cannot exceed 2000 characters",
            ],
            default: "",
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Project owner is required"],
        },

        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        status: {
            type: String,
            enum: ["planning", "in-progress", "completed", "on-hold"],
            default: "planning",
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
        },

        startDate: {
            type: Date,
            default: null,
        },

        dueDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;