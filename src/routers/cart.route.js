const express = require("express");
const router = express.Router();
const AsyncHandle = require("../helpers/AsyncHandle");
const CartController = require("../controller/cart.controller");
const { authentication } = require("../auth/authUtils");

router.use(authentication);
router.get("/", AsyncHandle(CartController.list));
router.post("/add", AsyncHandle(CartController.AddProducts));
router.post("/remove", AsyncHandle(CartController.RemoveProducts));

module.exports = router;
