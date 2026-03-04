const { verifyRefreshToken } = require("../../auth/token.service");
const fs = require("fs");
const User = require("../../models/userModel");

exports.getCVByIdController = async (req, res) => {

    try {
        const token = req.cookies.refreshToken;
        const decodedToken = verifyRefreshToken(token);
        const userId = decodedToken.id;

        const cv = await User.findByPk(userId, {
            attributes: ["cv", "name"],
        });

        if (!cv.cv) {
            return res.status(404).json({ message: "CV not found" });
        }

        res.status(200).json({
            ok: true,
            code: "CV_FETCHED_SUCCESSFULLY",
            message: "CV fetched successfully",
            data: cv
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateCVController = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        const decodedToken = verifyRefreshToken(token);
        const userId = decodedToken.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.cv = req.file.path;
        await user.save();

        res.status(200).json({
            ok: true,
            code: "CV_UPDATED_SUCCESSFULLY",
            message: "CV updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        fs.unlinkSync(req.file.path);
    }
}

exports.deleteCVController = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        const decodedToken = verifyRefreshToken(token);
        const userId = decodedToken.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.cv = null;
        await user.save();

        res.status(200).json({
            ok: true,
            code: "CV_DELETED_SUCCESSFULLY",
            message: "CV deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
