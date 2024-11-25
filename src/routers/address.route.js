const express = require("express");
const router = express.Router();
const AsyncHandle = require("../helpers/AsyncHandle");
const AddressController = require("../controller/address.controller");

// router.use(authentication);

router.get("/", AsyncHandle(AddressController.GetCities));
router.get("/district/:code", AsyncHandle(AddressController.GetDistrict));
router.get("/ward/:code", AsyncHandle(AddressController.GetWard));
module.exports = router;
