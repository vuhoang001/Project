const { BadRequestError } = require("../core/error.response");
const bookModel = require("../models/book.model");
const { uploadImageFromLocalFiles } = require("../helpers/cloudinary");
const { pagination } = require("../utils/index");

class BookService {
  CreateBook = async (payload, files) => {
    const image = await uploadImageFromLocalFiles(files);
    if (image) {
      payload.imageBook = image[0].thumb_url;
    }
    const data = await bookModel.create(payload);
    if (!data) throw new BadRequestError("Cant create book");

    return data;
  };

  GetAllBook = async (page, limit) => {
    const { limitNumber, skip } = pagination(page, limit);
    const data = await bookModel.find({}).limit(limitNumber).skip(skip);
    if (!data) throw new BadRequestError("Cant get all book");
    return data;
  };

  GetBook = async (slug) => {
    const data = await bookModel.findOne({ slug: slug });
    if (!data) throw new BadRequestError("Cant get book");
    return data;
  };

  EditBook = async (slug, payload, files) => {
    if (!slug) throw new BadRequestError("Cant edit book");
    const holderBook = await bookModel.findOne({ slug: slug });
    if (!holderBook) throw new BadRequestError("Cant edit book");
    const image = await uploadImageFromLocalFiles(files);
    if (image) {
      payload.imageBook = image[0].thumb_url;
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
