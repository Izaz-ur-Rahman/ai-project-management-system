const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");

const authenticate = async (req, res, next) => {
    try {
        // 1. Get Authorization header
        const authHeader = req.headers.authorization;

        // 2. Check whether Bearer token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required",
            });
        }

        // 3. Extract JWT
        const token = authHeader.split(" ")[1];

        // 4. Verify JWT
        const decoded = verifyToken(token);

        // 5. Find user from JWT userId
        const user = await User.findById(decoded.userId).select("-password");

        // 6. Check whether user still exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // 7. Attach authenticated user to request
        req.user = user;

        // 8. Continue to controller
        next();
    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token",
        });
    }
};

module.exports = authenticate;