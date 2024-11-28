const { BadRequestError } = require("../core/error.response");
const bookModel = require("../models/book.model");
const { uploadImageFromLocalFiles } = require("../helpers/cloudinary");
const {
  pagination,
  convertUrlBook,
  convertToObjectIdMongose,
} = require("../utils/index");

class BookService {
  CreateBook = async (payload, files) => {
    if (files) {
      payload.imageBook = convertUrlBook(files[0].filename);
    }
    const data = await bookModel.create(payload);
    if (!data) throw new BadRequestError("Cant create book");

    return data;
  };

  GetAllBook = async (page, limit, keyword, genre) => {
    const { limitNumber, skip } = pagination(page, limit);
    let query = {};
    if (keyword) {
      query = {
        $or: [
          { bookName: { $regex: keyword, $options: "i" } },
          { bookDescription: { $regex: keyword, $options: "i" } },
          { summary: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    let data = await bookModel
      .find(query)
      .populate("authorBook")
      .populate("genre")
      .limit(limitNumber)
      .skip(skip);
    if (!data || data.length === 0)
      throw new BadRequestError("Can't get all books");

    if (genre) {
      data = data.filter((item) => item.genre.slug === genre);
    }
    return data;
  };

  GetDiscountBook = async () => {
    const holderData = await bookModel.find({ discount: { $gt: 0 } });
    if (holderData.length == 0) {
      throw new BadRequestError("no datas");
    }
    return holderData;
  };

  UpdateDiscountBook = async (ids, percent, type) => {
    let query = {};
    if (type == "group") {
      query = { _id: { $in: ids } };
    }
    if (type == "genre") {
      query = { genre: { $in: ids } };
    }

    const holderData = await bookModel.find(query);
    if (holderData.length == 0) throw new BadRequestError("no datas");

    const discountUpdate = { $set: { discount: percent } };
    const updateResult = await bookModel.updateMany(query, discountUpdate);
    return updateResult;
  };

  GetBook = async (slug) => {
    const data = await bookModel.findOne({ slug: slug }).populate("authorBook");
    if (!data) throw new BadRequestError("Cant get book");
    return data;
  };

  EditBook = async (slug, payload, files = null) => {
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
