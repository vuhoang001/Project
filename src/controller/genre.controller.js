const genreService = require("../services/genre.service");
const { SuccessResponse } = require("../core/success.response");
class GenreController {
  CreateGenre = async (req, res, next) => {
    new SuccessResponse({
      message: "Create genre success",
      metadata: await genreService.CreateGenre(req.body),
    }).send(res);
  };

  GetAllGenres = async (req, res, next) => {
    const { page, limit } = req.query;
    new SuccessResponse({
      message: "Get all genre success",
      metadata: await genreService.GetAllGenres(page, limit),
    }).send(res);
  };

  GetGenre = async (req, res, next) => {
    const slug = req.params.slug;
    new SuccessResponse({
      message: "Get genre success",
      metadata: await genreService.GetGenre(slug),
    }).send(res);
  };

  EditGenre = async (req, res, next) => {
    const slug = req.params.slug;
    new SuccessResponse({
      message: "Edit genre success",
      metadata: await genreService.EditGenre(slug, req.body),
    }).send(res);
  };

  DeleteGenre = async (req, res, next) => {
    const slug = req.params.slug;
    new SuccessResponse({
      message: "Delete genre success",
      metadata: await genreService.DeleteGenre(slug),
    }).send(res);
  };
}

module.exports = new GenreController();
