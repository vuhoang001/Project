const express = require("express");
const router = express.Router();

router.use("/author", require("./author.route"));
router.use("/genre", require("./genre.route"));
router.use("/book", require("./book.route"));

router.use("/", require("./access.route"));
module.exports = router;
