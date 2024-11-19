const { BadRequestError } = require("../core/error.response");
const bookModel = require("../models/book.model");
const { uploadImageFromLocalFiles } = require("../helpers/cloudinary");
const { pagination, convertUrlBook } = require("../utils/index");

class BookService {
  CreateBook = async (payload, files) => {
    if (files) {
      payload.imageBook = convertUrlBook(files[0].filename);
    }
    const data = await bookModel.create(payload);
    if (!data) throw new BadRequestError("Cant create book");

    return data;
  };

  GetAllBook = async (page, limit, keyword) => {
    const { limitNumber, skip } = pagination(page, limit);
    const query = keyword
      ? {
          $or: [
            { bookName: { $regex: keyword, $options: "i" } },
            { bookDescription: { $regex: keyword, $options: "i" } },
            { summary: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};
    const data = await bookModel
      .find(query)
      .populate("authorBook")
      .populate("genre")
      .limit(limitNumber)
      .skip(skip);
    if (!data || data.length === 0)
      throw new BadRequestError("Can't get all books");
    return data;
  };

  GetBook = async (slug) => {
    const data = await bookModel.findOne({ slug: slug }).populate("authorBook");
    if (!data) throw new BadRequestError("Cant get book");
    return data;
  };

  EditBook = async (slug, payload, files = null) => {
    console.log(payload);
    if (!slug) throw new BadRequestError("Cant edit book");
    const holderBook = await bookModel.findOne({ slug: slug });
    if (!holderBook) throw new BadRequestError("Cant edit book");
    if (files && files.length > 0) {
      payload.imageBook = convertUrlBook(files[0].filename);
    }
    Object.assign(holderBook, payload);
    const data = await holderBook.save();
    if (!data) throw new BadRequestError("Cant edit 3");
    return data;
  };

  DeleteBook = async (slug) => {
    const holderBook = await bookModel.findOne({ slug: slug });
    if (!holderBook) throw new BadRequestError("Cant delete book");
    const data = await bookModel.deleteOne({ _id: holderBook._id });
    if (data.deletedCount == 0) throw new BadRequestError("Cant delete 2");
    return "1";
  };
}

module.exports = new BookService();
