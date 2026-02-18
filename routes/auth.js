const express = require("express");
const router = express.Router();
const { validate, userSignupSchema, userLoginSchema } = require("../middlewares/validators");
const { loginController, signupController, logoutController, refreshController } = require("../controllers/auth/auth.controller");


router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.post("/login", validate(userLoginSchema), loginController);
router.post("/signup", validate(userSignupSchema), signupController);

module.exports = router;