const express = require("express");
const router = express.Router();
const AsyncHandle = require("../helpers/AsyncHandle");
const OrderController = require("../controller/order.controller");
const { authentication } = require("../auth/authUtils");

router.post("/", authentication, AsyncHandle(OrderController.checkout));
router.get("/", authentication, AsyncHandle(OrderController.GetOrder));
router.get("/all", authentication, AsyncHandle(OrderController.GetOrders));
router.get("/gbu", authentication, AsyncHandle(OrderController.GetOrderByUser));
router.patch("/", authentication, AsyncHandle(OrderController.Update));

module.exports = router;
