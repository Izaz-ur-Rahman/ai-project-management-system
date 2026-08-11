const register = async (req, res) => {
    res.status(501).json({
        success: false,
        message: "Register endpoint not implemented yet",
    });
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