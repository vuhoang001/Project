const express = require("express");
const router = express.Router();
const authorController = require("../controller/author.controller");
const AsyncHandle = require("../helpers/AsyncHandle");
const { authentication } = require("../auth/authUtils");
const { uploadDisk } = require("../config/multer.config");

/**
 * @swagger
 *  tags:
 *    name: Author
 *    description: Author management
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      AuthorModel:
 *        type: object
 *        properties:
 *          items:
 *            type: string
 *            default: {     "authorName": "Author 1",      "bio": "This is bio of author" }
 *          files:
 *            type: string
 *            format: binary
 */

/**
 * @swagger
 *  /v1/api/author:
 *    post:
 *      summary: Create author
 *      tags: [Author]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true,
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/AuthorModel'
 *      responses:
 *        200:
 *          description: success
 */
router.post(
  "/",
  authentication,
  uploadDisk.array("files", 1),
  AsyncHandle(authorController.CreateAuthor)
);

/**
 * @swagger
 *  /v1/api/author:
 *    get:
 *      summary: Get all author
 *      tags: [Author]
 *      parameters: 
 *        - $ref: '#/components/parameters/Skip'
 *        - $ref: '#/components/parameters/Limit'
 *        - $ref: '#/components/parameters/Search'
 *      responses:
 *        200:
 *          description: success
 */
router.get("/", AsyncHandle(authorController.GetAllAuthors));
router.get("/:slug", AsyncHandle(authorController.GetAuthor));
router.patch(
  "/:slug",
  authentication,
  uploadDisk.array("files", 1),
  AsyncHandle(authorController.EditAuthor)
);
router.delete(
  "/:slug",
  authentication,
  AsyncHandle(authorController.DeleteAuthor)
);
module.exports = router;
