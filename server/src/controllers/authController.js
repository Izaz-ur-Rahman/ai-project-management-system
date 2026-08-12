const User = require("../models/User");

const {
    hashPassword,
    comparePassword,
} = require("../utils/password");

const {
    generateToken,
} = require("../utils/jwt");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        const token = generateToken({
            userId: user._id.toString(),
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const login = async (req, res) => {
    res.status(501).json({
        success: false,
        message: "Login endpoint not implemented yet",
    });
};

const getCurrentUser = async (req, res) => {
    res.status(501).json({
        success: false,
        message: "Current user endpoint not implemented yet",
    });
};

module.exports = {
    register,
    login,
    getCurrentUser,
};