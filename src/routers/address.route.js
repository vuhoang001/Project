const express = require("express");
const router = express.Router();
const AsyncHandle = require("../helpers/AsyncHandle");
const AddressController = require("../controller/address.controller");

// router.use(authentication);

router.get("/", AsyncHandle(AddressController.GetCode));
module.exports = router;
