const express = require("express");
const router = express.Router();
const AccessController = require("../controller/access.controller");
const AsyncHandle = require("../helpers/AsyncHandle");
const { authentication } = require("../auth/authUtils");
const { uploadDisk } = require("../config/multer.config");

/**
 * @swagger
 *  tags:
 *    name: Account
 *    description: Account management
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      RegisterModel:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            description: "Name of the user"
 *            default: client
 *          email:
 *            type: string
 *            description: "Email of the user"
 *            default: "client@gmail.com"
 *          password:
 *            type: string
 *            description: "Password of the account"
 *            default: "1234@Abcd"
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      LoginModel:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *            description: "Email of the user"
 *            default: "client@gmail.com"
 *          password:
 *            type: string
 *            description: "Password of the account"
 *            default: "1234@Abcd"
 */

/**
 * @swagger
 *  /v1/api/signUp:
 *    post:
 *      summary: Register
 *      tags: [Account]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RegisterModel'
 *      responses:
 *        200:
 *          description: success
 *
 */
router.post("/signUp", AsyncHandle(AccessController.signUp));

/**
 * @swagger
 *  /v1/api/login:
 *    post:
 *      summary: Login
 *      tags: [Account]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginModel'  # Correct reference to LoginModel schema
 *      responses:
 *        200:
 *          description: success
 *
 */
router.post("/login", AsyncHandle(AccessController.login));
router.get("/handleOTP", AsyncHandle(AccessController.handleOTP));
router.post("/passwordReset", AsyncHandle(AccessController.resetPassword));

router.get("/getme", authentication, AsyncHandle(AccessController.getMe));

router.patch(
  "/update-image",
  authentication,
  uploadDisk.array("files", 1),
  AsyncHandle(AccessController.updateImage)
);
router.patch(
  "/updateme",
  authentication,
  AsyncHandle(AccessController.UpdateUser)
);
router.patch(
  "/change-password",
  authentication,
  AsyncHandle(AccessController.changePassword)
);

/**
 * @swagger
 *  /v1/api/refreshToken:
 *      post:
 *          summary: Refresh token
 *          tags: [Account]
 *          parameters:
 *              - $ref: '#/components/parameters/RefreshToken'
 *          responses:
 *              200:
 *                  description: success
 *              401:
 *                  description: Unauthorized (token invalid or missing)
 */
router.post(
  "/refreshToken",
  authentication,
  AsyncHandle(AccessController.refreshTokenHandle)
);
router.post("/logout", authentication, AsyncHandle(AccessController.logOut));

module.exports = router;
