const AsyncHandle = require("../helpers/AsyncHandle");
const BookController = require("../controller/book.controller");
const express = require("express");
const router = express.Router();
const { uploadDisk } = require("../config/multer.config");
const { authentication } = require("../auth/authUtils");

/**
 * @swagger
 *  tags:
 *    name: Book
 *    description: Book management
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      BookModel:
 *        type: object
 *        properties:
 *          items:
 *            type: string
 *            default: {     "bookName": "Book name",      "authorBook": "674543c0d86783fc273ed4de",      "genre": "674548cdd86783fc273ed571",      "bookDescription": "Book bookDescription",      "summary": "Book summary",      "quantity": 10,      "price": 20000,      "totalPages": 120,      "importPrice": 15000,      "size": "36x36",      "rating": 3,      "discount": 10 }
 *          files:
 *            type: string
 *            format: binary
 *
 */

/**
 * @swagger
 *  /v1/api/book:
 *    post:
 *      summary: Create book
 *      tags: [Book]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/BookModel'
 *      responses:
 *        200:
 *          description: success
 */
router.post(
  "/",
  authentication,
  uploadDisk.array("files", 1),
  AsyncHandle(BookController.CreateBook)
);

/**
 * @swagger
 *  /v1/api/book:
 *    get:
 *      summary: Get all books
 *      tags: [Book]
 *      responses:
 *        200:
 *          description: success
 */
router.get("/", AsyncHandle(BookController.GetAllBook));
router.get(
  "/discount",
  authentication,
  AsyncHandle(BookController.GetDiscountBook)
);
router.post(
  "/discount",
  authentication,
  AsyncHandle(BookController.UpdateDiscountBook)
);

/**
 * @swagger
 *  /v1/api/book/{slug}:
 *    get:
 *      summary: Get book
 *      tags: [Book]
 *      parameters:
 *        - $ref: '#/components/parameters/SlugParam'
 *      responses:
 *        200:
 *          description: success
 */
router.get("/:slug", AsyncHandle(BookController.GetBook));

/**
 * @swagger
 *  /v1/api/book/{slug}:
 *    delete:
 *      summary: Delete book
 *      tags: [Book]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/SlugParam'
 *      responses:
 *        200:
 *          description: success
 *
 */
router.delete("/:slug", authentication, AsyncHandle(BookController.Delete));

/**
 * @swagger
 *  /v1/api/book:
 *    patch:
 *      summary: Update book
 *      tags: [Book]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/BookModel'
 *      responses:
 *        200:
 *          description: success
 */
router.patch(
  "/:slug",
  authentication,
  uploadDisk.array("files", 1),
  AsyncHandle(BookController.Edit)
);

module.exports = router;
