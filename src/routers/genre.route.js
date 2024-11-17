const express = require("express");
const router = express.Router();
const genreController = require("../controller/genre.controller");
const AsyncHandle = require("../helpers/AsyncHandle");
// const { authentication } = require("../auth/authUtils");

// router.use(authentication);

router.post("/", AsyncHandle(genreController.CreateGenre));
router.get("/", AsyncHandle(genreController.GetAllGenres));
router.get("/:slug", AsyncHandle(genreController.GetGenre));
router.patch("/:slug", AsyncHandle(genreController.EditGenre));
router.delete("/:slug", AsyncHandle(genreController.DeleteGenre));
module.exports = router;
