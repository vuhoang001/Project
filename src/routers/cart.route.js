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
 * /v1/api/cart/add/{a}:
 *   post:
 *     summary: Add products to a user's cart
 *     tags: [Cart]
 *     security:
 *      - bearerAuth: []
 *     description: Adds one or more products to the cart, either updating existing products' quantities or adding new products.
 *     operationId: addProductToCart
 *     parameters:
 *       - name: a
 *         in: params
 *         description: The action type for the cart (1 to increment quantity, other values to set quantity).
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: List of products to be added to the cart.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                   description: The ID of the product.
 *                   example: "6745493cd86783fc273ed579"
 *                 quantity:
 *                   type: integer
 *                   description: The quantity of the product to add.
 *                   example: 2
 *                 price:
 *                   type: number
 *                   description: The price of the product.
 *                   example: 29.99
 *     responses:
 *       '200':
 *         description: Success, product(s) added to the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Add to cart
 *                 metadata:
 *                   type: object
 *                   description: Metadata with added cart information
 */
router.post("/add/:a", authentication, AsyncHandle(CartController.AddProducts));

/**
 * @swagger
 *  /v1/api/cart/remove:
 *    post:
 *      summary: Remove product from cart
 *      tags: [Cart]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                ids:
 *                  type: array
 *                  items:
 *                    type: string
 *      responses:
 *        200:
 *            description: success
 */
router.post(
  "/remove",
  authentication,
  AsyncHandle(CartController.RemoveProducts)
);

module.exports = router;
