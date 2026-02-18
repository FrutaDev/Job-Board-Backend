const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokensModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { comparePassword, hashPassword } = require("./hash.service");
const { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken } = require("./token.service");

exports.register = async (user) => {
    const { name, email, password } = user;
    const hashedPassword = hashPassword(password);
    const newUser = await User.create({ name, email, password: hashedPassword });
    return newUser;
};

exports.login = async (credentials) => {
    try {
        console.log("Login service")
        const { email, password } = credentials;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return {
                ok: false,
                code: "USER_NOT_FOUND",
                message: "Usuario no encontrado"
            }
        }
        const isPasswordValid = comparePassword(password, user.password);
        if (!isPasswordValid) {
            return {
                ok: false,
                code: "INVALID_CREDENTIALS",
                message: "Email o contraseña incorrectos"
            }
        }
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        await RefreshToken.create({ token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        return {
            ok: true,
            code: "SUCCESS",
            message: "User logged in successfully",
            token,
            refreshToken
        };
    } catch (error) {
        return {
            ok: false,
            code: "SERVER_ERROR",
            message: "An error occurred while logging in"
        }
    }
};

exports.signup = async (credentials) => {
    try {
        console.log("Signup service")
        const { name, lastName, email, password, confirmPassword } = credentials;
        const user = await User.findOne({ where: { email } });
        if (user) {
            return {
                ok: false,
                code: "USER_ALREADY_EXISTS",
                message: "User already exists"
            }
        }
        if (password !== confirmPassword) {
            return {
                ok: false,
                code: "PASSWORDS_DONT_MATCH",
                message: "Passwords don't match"
            }
        }
        const hashedPassword = hashPassword(password);
        const newUser = await User.create({ name, lastName, email, password: hashedPassword });
        const token = generateToken(newUser);
        const refreshToken = generateRefreshToken(newUser);
        console.log("Refresh token", refreshToken);
        await RefreshToken.create({ token: refreshToken, userId: newUser.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        console.log("Refresh token created");
        return {
            ok: true,
            code: "SUCCESS",
            message: "User signed up successfully",
            token,
            refreshToken
        };
    } catch (error) {
        return {
            ok: false,
            code: "SERVER_ERROR",
            message: "An error occurred while signing up"
        }
    }
};

exports.logout = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
        await RefreshToken.destroy({ where: { userId: decoded.id } });
        return {
            ok: true,
            code: "SUCCESS",
            message: "User logged out successfully"
        };
    } catch (error) {
        return {
            ok: false,
            code: "SERVER_ERROR",
            message: "An error occurred while logging out"
        }
    }
};

exports.refresh = async (refreshToken) => {
    try {
        if (!refreshToken) {
            return {
                ok: false,
                code: "REFRESH_TOKEN_NOT_FOUND",
                message: "Refresh token not found"
            }
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
        const refreshTokenDB = await RefreshToken.findOne({ where: { userId: decoded.id } });
        if (!refreshTokenDB) {
            return {
                ok: false,
                code: "REFRESH_TOKEN_NOT_FOUND",
                message: "Refresh token not found"
            }
        }
        if (new Date() > refreshTokenDB.expiresAt) {
            return {
                ok: false,
                code: "REFRESH_TOKEN_EXPIRED",
                message: "Refresh token expired"
            }
        }
        const payload = verifyRefreshToken(refreshToken);

        const user = await User.findOne({ where: { id: payload.id } });
        if (!user) {
            return {
                ok: false,
                code: "USER_NOT_FOUND",
                message: "User not found"
            }
        }

        const newAccessToken = generateToken(user);

        return {
            ok: true,
            code: "SUCCESS",
            message: "User logged in successfully",
            token: newAccessToken
        };
    } catch (error) {
        return {
            ok: false,
            code: "SERVER_ERROR",
            message: "An error occurred while logging in"
        }
    }
};