const { extractUserId } = require("../auth/token.service");

exports.setUserId = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            ok: false,
            code: "UNAUTHORIZED",
            message: "No se proporcionó un token de autenticación."
        });
    }

    req.userId = extractUserId(req.headers.authorization.split(" ")[1]);

    if (!req.userId) {
        return res.status(401).json({
            ok: false,
            code: "UNAUTHORIZED",
            message: "No se proporcionó un token de autenticación válido."
        });
    }

    next();
}