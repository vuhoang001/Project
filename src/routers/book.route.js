const AsyncHandle = require("../helpers/AsyncHandle");
const BookController = require("../controller/book.controller");
const express = require("express");
const router = express.Router();
const { uploadDisk } = require("../config/multer.config");
const { authentication } = require("../auth/authUtils");

// router.use(authentication);
router.post(
  "/",
  uploadDisk.array("files", 1),
  AsyncHandle(BookController.CreateBook)
);
router.get("/", AsyncHandle(BookController.GetAllBook));
router.get("/discount", AsyncHandle(BookController.GetDiscountBook));
router.post("/discount", AsyncHandle(BookController.UpdateDiscountBook));
router.get("/:slug", AsyncHandle(BookController.GetBook));
router.delete("/:slug", AsyncHandle(BookController.Delete));
router.patch(
  "/:slug",
  uploadDisk.array("files", 1),
  AsyncHandle(BookController.Edit)
);

module.exports = router;
