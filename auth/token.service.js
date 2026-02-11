const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
    },
        process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

exports.generateRefreshToken = (user) => {
    return jwt.sign({
        id: user.id
    },
        process.env.REFRESH_JWT_SECRET, {
        expiresIn: "7d",
    });
};

exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};