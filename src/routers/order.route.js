const express = require("express");
const router = express.Router();
const AsyncHandle = require("../helpers/AsyncHandle");
const OrderController = require("../controller/order.controller");
const { authentication } = require("../auth/authUtils");

router.use(authentication);
router.post("/", AsyncHandle(OrderController.checkout));
router.get("/", AsyncHandle(OrderController.GetOrder));
router.get("/all", AsyncHandle(OrderController.GetOrders));

module.exports = router;
