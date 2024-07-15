const express = require("express");
const router = express.Router();

router.use("/", require("./access/index"));

module.exports = router;
