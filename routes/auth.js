const express = require("express");
const router = express.Router();
const { validate, userSignupSchema, userLoginSchema } = require("../middlewares/validators");
const { loginController, signupController, logoutController, refreshController } = require("../controllers/auth/auth.controller");


router.post("/login", validate(userLoginSchema), loginController);
router.post("/signup", validate(userSignupSchema), signupController);
router.post("/logout", logoutController);
router.post("/refresh", refreshController);

module.exports = router;