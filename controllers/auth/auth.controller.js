const { signup, login, logout, refresh } = require("../../auth/auth.service");
const User = require("../../models/userModel");
const RefreshToken = require("../../models/refreshTokensModel");
const { generateToken, generateRefreshToken, verifyToken } = require("../../auth/token.service");
const { hashPassword } = require("../../auth/hash.service");
require("dotenv").config();

exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                code: "BAD_REQUEST",
                message: "Email y contraseña son obligatorios"
            });
        }
        const result = await login({ email, password });
        if (!result.ok) {
            return res.status(401).json(result);
        }
        return res.status(200)
            .cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            })
            .json({
                ok: true,
                code: "SUCCESS",
                message: "User logged in successfully",
                token: result.token,
            });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
};

exports.signupController = async (req, res) => {
    try {
        const { name, lastName, email, password, confirmPassword } = req.body;
        if (!name || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({
                ok: false,
                code: "BAD_REQUEST",
                message: "All fields are required"
            });
        }
        const result = await signup({ name, lastName, email, password, confirmPassword });
        if (!result.ok) {
            return res.status(401).json(result);
        }
        return res.status(200)
            .cookie(
                "refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            }
            )
            .json({
                ok: true,
                code: "SUCCESS",
                message: "User signed up successfully",
                token: result.token,
            });
    } catch (error) {
        console.error("Error signing up:", error);
        return res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
};

exports.logoutController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({
                ok: false,
                code: "BAD_REQUEST",
                message: "Refresh token is required"
            });
        }
        const result = await logout(refreshToken);
        if (!result.ok) {
            return res.status(401).json(result);
        }
        return res.status(200)
            .clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            })
            .json(result);
    } catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
};

exports.refreshController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({
                ok: false,
                code: "BAD_REQUEST",
                message: "Refresh token is required"
            });
        }
        const result = await refresh(refreshToken);
        if (!result.ok) {
            return res.status(401).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
};

