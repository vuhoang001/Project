const express = require("express");
const router = express.Router();
const authorController = require("../controller/author.controller");
const AsyncHandle = require("../helpers/AsyncHandle");
const { authentication } = require("../auth/authUtils");
const { uploadDisk } = require("../config/multer.config");

// router.use(authentication);

router.post(
  "/",
  uploadDisk.array("files", 1),
  AsyncHandle(authorController.CreateAuthor)
);
router.post(
  "/upload",
  uploadDisk.array("files", 1),
  AsyncHandle(authorController.Upload)
);
router.get("/", AsyncHandle(authorController.GetAllAuthors));
router.get("/:slug", AsyncHandle(authorController.GetAuthor));
router.patch(
  "/:slug",
  uploadDisk.array("files", 1),
  AsyncHandle(authorController.EditAuthor)
);
router.delete("/:slug", AsyncHandle(authorController.DeleteAuthor));
module.exports = router;
