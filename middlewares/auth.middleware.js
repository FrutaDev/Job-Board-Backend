const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = (requiredRoles = []) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({
                    ok: false,
                    code: "UNAUTHORIZED",
                    message: "No se proporciono un token"
                })
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    ok: false,
                    code: "INVALID_TOKEN",
                    message: "Token invalido"
                })
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (
                requiredRoles.length > 0 &&
                !requiredRoles.includes(decoded.role)
            ) {
                return res.status(403).json({
                    ok: false,
                    code: "FORBIDDEN",
                    message: "No tienes permiso para acceder a este recurso"
                })
            }

            next();
        } catch (error) {
            console.error(error);
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({
                    ok: false,
                    code: "TOKEN_EXPIRED",
                    message: "Tu sesión ha expirado, por favor inicia sesión de nuevo"
                });
            }
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    ok: false,
                    code: "INVALID_TOKEN",
                    message: "Token inválido"
                });
            }
            return res.status(500).json({
                ok: false,
                code: "INTERNAL_ERROR",
                message: "Error interno del servidor"
            });
        }
    }
}