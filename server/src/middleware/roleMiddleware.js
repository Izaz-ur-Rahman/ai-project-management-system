const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to perform this action",
                });
            }

            next();
        } catch (error) {
            console.error("Authorization error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };
};

module.exports = authorize;