const express = require("express");
const router = express.Router();
const { validate, userSignupSchema, userLoginSchema } = require("../middlewares/validators");
const { loginController, signupController, logoutController, refreshController, updateCVController } = require("../controllers/auth/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { uploadCV } = require("../middlewares/uploadFile");


router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.post("/login", validate(userLoginSchema), loginController);
router.post("/signup", validate(userSignupSchema), signupController);
router.put("/update-cv", authMiddleware(["user"]), uploadCV.single("cv"), updateCVController);

module.exports = router;