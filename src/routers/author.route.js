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
 *      summary: Get all authors
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

/**
 * @swagger
 *  /v1/api/author/{slug}:
 *    get:
 *      summary: Get by slug
 *      tags: [Author]
 *      parameters:
 *        - $ref: '#/components/parameters/SlugParam'
 *      responses:
 *        200:
 *          description: success
 */
router.get("/:slug", AsyncHandle(authorController.GetAuthor));

/**
 * @swagger
 *  /v1/api/author/{slug}:
 *    patch:
 *      summary: Update author
 *      tags: [Author]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/SlugParam'
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/AuthorModel'
 *      responses:
 *        200:
 *          description: success
 */
router.patch(
  "/:slug",
  authentication,
  uploadDisk.array("files", 1),
  AsyncHandle(authorController.EditAuthor)
);

/**
 * @swagger
 *  /v1/api/author/{slug}:
 *    delete:
 *      summary: Delete author
 *      tags: [Author]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/SlugParam'
 *      responses:
 *        200:
 *          description: success
 */
router.delete(
  "/:slug",
  authentication,
  AsyncHandle(authorController.DeleteAuthor)
);
module.exports = router;
