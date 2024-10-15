const express = require("express");
const router = express.Router();
const AccessController = require("../controller/access.controller");
const AsyncHandle = require("../helpers/AsyncHandle");
const { authentication } = require("../auth/authUtils");

router.post("/signUp", AsyncHandle(AccessController.signUp));
router.post("/login", AsyncHandle(AccessController.login));
router.get("/handleOTP", AsyncHandle(AccessController.handleOTP));
router.post("/passwordReset", AsyncHandle(AccessController.resetPassword));

router.use(authentication);

router.post("/refreshToken", AsyncHandle(AccessController.refreshTokenHandle));
router.post("/logout", AsyncHandle(AccessController.logOut));

module.exports = router;
