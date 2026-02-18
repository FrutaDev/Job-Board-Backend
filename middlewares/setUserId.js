const { extractUserId } = require("../auth/token.service");

exports.setUserId = (req, res, next) => {
    console.log("🚀🚀🚀 Entrando a set user id middleware")
    console.log(req.cookies.refreshToken)
    if (!req.cookies.refreshToken) {
        req.userId = null;
        return next();
    }

    try {
        req.userId = extractUserId(req.cookies.refreshToken);
    } catch (error) {
        req.userId = null;
    }

    next();
}