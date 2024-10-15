const express = require("express");
const router = express.Router();

router.use("/", require("./access.route"));

module.exports = router;
