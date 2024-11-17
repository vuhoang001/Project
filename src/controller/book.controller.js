const { SuccessResponse } = require("../core/success.response");
const bookService = require("../services/book.service");

class BookController {
  CreateBook = async (req, res, next) => {
    const { files } = req;
    new SuccessResponse({
      message: "Create book success",
      metadata: await bookService.CreateBook(req.body, files),
    }).send(res);
  };

  GetAllBook = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const { keySearch } = req.query;
    new SuccessResponse({
      message: "Get all books",
      metadata: await bookService.GetAllBook(page, limit, keySearch),
    }).send(res);
  };

  GetBook = async (req, res, next) => {
    const { slug } = req.params;
    new SuccessResponse({
      message: "Get book",
      metadata: await bookService.GetBook(slug),
    }).send(res);
  };

  Delete = async (req, res, next) => {
    const slug = req.params.slug;
    new SuccessResponse({
      message: "Delete book",
      metadata: await bookService.DeleteBook(slug),
    }).send(res);
  };

  Edit = async (req, res, next) => {
    const slug = req.params.slug;
    const { files } = req;
    console.log(slug);
    new SuccessResponse({
      message: "Edit book",
      metadta: await bookService.EditBook(slug, req.body, files),
    }).send(res);
  };
}

module.exports = new BookController();
