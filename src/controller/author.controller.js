const authorService = require("../services/author.service");
const { SuccessResponse } = require("../core/success.response");
class AuthorController {
  CreateAuthor = async (req, res, next) => {
    const { files } = req;
    const items = req.body.items;
    new SuccessResponse({
      message: "Create author success",
      metadata: await authorService.CreateAuthor(items, files),
    }).send(res);
  };

  GetAuthor = async (req, res, next) => {
    const slug = req.params.slug;
    new SuccessResponse({
      message: "Get author success",
      metadata: await authorService.GetAuthor(slug),
    }).send(res);
  };

  GetAllAuthors = async (req, res, next) => {
    const { page = 1, limit = 100 } = req.query;
    new SuccessResponse({
      message: "Get all authors",
      metadata: await authorService.GetAllAuthors(page, limit),
    }).send(res);
  };

  EditAuthor = async (req, res, next) => {
    const { files } = req;
    const slug = req.params.slug;
    new SuccessResponse({
      message: "Edit author success",
      metadata: await authorService.EditAuthor(slug, req.body.items, files),
    }).send(res);
  };

  DeleteAuthor = async (req, res, next) => {
    const slug = req.params.slug;
    new SuccessResponse({
      message: "Delete author success",
      metadata: await authorService.DeleteAuthor(slug),
    }).send(res);
  };
}

module.exports = new AuthorController();
