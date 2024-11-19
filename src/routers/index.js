const express = require("express");
const router = express.Router();

router.use("/address", require("./address.route"));
router.use("/payment", require("./payment.route"));
router.use("/genre", require("./genre.route"));
router.use("/author", require("./author.route"));
router.use("/book", require("./book.route"));

router.use("/", require("./access.route"));
module.exports = router;
