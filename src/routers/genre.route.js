const express = require("express");
const router = express.Router();
const genreController = require("../controller/genre.controller");
const AsyncHandle = require("../helpers/AsyncHandle");
const { authentication } = require("../auth/authUtils");

/**
 * @swagger
 *  tags:
 *      name: Genre
 *      description: Genre management
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          GenreModel:
 *              type: object
 *              properties:
 *                  genreName:
 *                    type: string
 *                    default: "Genre 1"
 *                  genreDescription:
 *                    type: string
 *                    default: "Description of genre 1"
 */

/**
 * @swagger
 *  /v1/api/genre:
 *    post:
 *      summary: Create genre
 *      tags: [Genre]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GenreModel'
 *      responses:
 *        200:
 *          description: success
 */
router.post("/", authentication, AsyncHandle(genreController.CreateGenre));

/**
 * @swagger
 *  /v1/api/genre:
 *    get:
 *      summary: Get all genre
 *      tags: [Genre]
 *      parameters:
 *        - $ref: '#/components/parameters/Skip'
 *        - $ref: '#/components/parameters/Limit'
 *        - $ref: '#/components/parameters/Search'
 *      responses:
 *        200:
 *          description: success
 */
router.get("/", AsyncHandle(genreController.GetAllGenres));

/**
 * @swagger
 *  /v1/api/genre/{slug}:
 *    get:
 *      summary: Get by slug
 *      tags: [Genre]
 *      parameters:
 *        - $ref: '#/components/parameters/SlugParam'
 *      responses:
 *        200:
 *          description: success
 */
router.get("/:slug", AsyncHandle(genreController.GetGenre));

/**
 * @swagger
 *  /v1/api/genre/{slug}:
 *    patch:
 *      summary: Update genre
 *      tags: [Genre]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/SlugParam'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GenreModel'
 *      responses:
 *        200:
 *          description: success
 */
router.patch("/:slug", authentication, AsyncHandle(genreController.EditGenre));

/**
 * @swagger
 *  /v1/api/genre/{slug}:
 *    delete:
 *      summary: Delete genre
 *      tags: [Genre]
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
  AsyncHandle(genreController.DeleteGenre)
);
module.exports = router;
