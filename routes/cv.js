const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { getCVByIdController, updateCVController, deleteCVController } = require("../controllers/cv/cv.controller");
const { uploadCV } = require("../middlewares/uploadFile");
const router = express.Router();

router.get("/", authMiddleware(["admin", "user"]), getCVByIdController);

router.put("/", authMiddleware(["admin", "user"]), uploadCV.single("cv"), updateCVController);

router.delete("/", authMiddleware(["admin", "user"]), deleteCVController);

module.exports = router;