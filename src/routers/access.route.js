const express = require("express");
const router = express.Router();
const AccessController = require("../controller/access.controller");
const AsyncHandle = require("../helpers/AsyncHandle");
const { authentication } = require("../auth/authUtils");
const { uploadDisk } = require("../config/multer.config");

router.post("/signUp", AsyncHandle(AccessController.signUp));
router.post("/login", AsyncHandle(AccessController.login));
router.get("/handleOTP", AsyncHandle(AccessController.handleOTP));
router.post("/passwordReset", AsyncHandle(AccessController.resetPassword));

router.use(authentication);
router.get("/getme", AsyncHandle(AccessController.getMe));

router.patch(
  "/update-image",
  uploadDisk.array("files", 1),
  AsyncHandle(AccessController.updateImage)
);
router.patch("/updateme", AsyncHandle(AccessController.UpdateUser));
router.patch("/change-password", AsyncHandle(AccessController.changePassword));

router.post("/refreshToken", AsyncHandle(AccessController.refreshTokenHandle));
router.post("/logout", AsyncHandle(AccessController.logOut));

module.exports = router;
