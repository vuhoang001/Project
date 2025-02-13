const express = require("express");
const router = express.Router();
const AsyncHandle = require("../helpers/AsyncHandle");
const AddressController = require("../controller/address.controller");

// router.use(authentication);
/**
 * @swagger
 *  tags:
 *      name: Address
 *      description: Address management
 */

/**
 * @swagger
 *  /v1/api/address:
 *      get:
 *          summary: Get cities
 *          tags: [Address]
 *          responses:
 *              200:
 *                  description: success
 *
 */
router.get("/", AsyncHandle(AddressController.GetCities));

/**
 * @swagger
 *  /v1/api/address/district/{slug}:
 *      get:
 *          summary: Get district
 *          tags: [Address]
 *          parameters:
 *              - $ref: '#/components/parameters/SlugParam'
 *          responses:
 *              200:
 *                  description: success
 *
 */
router.get("/district/:code", AsyncHandle(AddressController.GetDistrict));

/**
 * @swagger
 *  /v1/api/address/ward/{slug}:
 *      get:
 *          summary: Get ward
 *          tags: [Address]
 *          parameters:
 *              - $ref: '#/components/parameters/SlugParam'
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/ward/:code", AsyncHandle(AddressController.GetWard));
module.exports = router;
