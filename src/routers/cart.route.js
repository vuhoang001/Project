const express = require("express");
const router = express.Router();
const AsyncHandle = require("../helpers/AsyncHandle");
const CartController = require("../controller/cart.controller");
const { authentication } = require("../auth/authUtils");

/**
 * @swagger
 *  tags:
 *    name: Cart
 *    description: Cart management
 */

/**
 * @swagger
 *  /v1/api/cart:
 *    get:
 *      summary: Get cart
 *      tags: [Cart]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: success
 */
router.get("/", authentication, AsyncHandle(CartController.list));

/**
 * @swagger
 *  /v1/api/cart/add:
 *    post:
 *      summary: Add to cart
 *      tags: [Cart]
 *      security:
 *        - bearerAuth: []
 */
router.post("/add", authentication, AsyncHandle(CartController.AddProducts));
router.post(
  "/remove",
  authentication,
  AsyncHandle(CartController.RemoveProducts)
);

module.exports = router;
