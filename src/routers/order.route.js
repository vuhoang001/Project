const express = require("express");
const router = express.Router();
const AsyncHandle = require("../helpers/AsyncHandle");
const OrderController = require("../controller/order.controller");
const { authentication } = require("../auth/authUtils");

/**
 * @swagger
 *  tags:
 *      name: Order
 *      description: Order management
 */

router.post("/", authentication, AsyncHandle(OrderController.checkout));

/**
 * @swagger
 *  /v1/api/checkout:
 *      get:
 *          summary: Get all order
 *          tags: [Order]
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/", authentication, AsyncHandle(OrderController.GetOrder));

/**
 * @swagger
 *  /v1/api/checkout/all:
 *      get:
 *          summary: Get all order
 *          tags: [Order]
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/all", authentication, AsyncHandle(OrderController.GetOrders));

/**
 * @swagger
 *  /v1/api/checkout/gbu:
 *      get:
 *          summary: Get order by user
 *          tags: [Order]
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/gbu", authentication, AsyncHandle(OrderController.GetOrderByUser));
router.patch("/", authentication, AsyncHandle(OrderController.Update));

module.exports = router;
