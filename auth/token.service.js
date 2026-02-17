const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateToken = (user) => {
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
    },
        process.env.JWT_SECRET, {
        expiresIn: "24h",
    });
    console.log(`[JWT] Token generated for user ${user.id} at ${new Date().toISOString()}. Expires in 24h.`);
    return token;
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

exports.verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_JWT_SECRET);
};

exports.extractUserId = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch (e) {
        console.error(`[JWT] extractUserId failed at ${new Date().toISOString()}:`, e.message);
        if (e.expiredAt) console.error(`[JWT] Token expired at: ${e.expiredAt.toISOString()}`);
        return null;
    }
};