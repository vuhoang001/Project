const authorModel = require("../models/author.model");
const { BadRequestError } = require("../core/error.response");
const { pagination, convertUrlBook } = require("../utils/index");
const { uploadImageFromLocalFiles } = require("../helpers/cloudinary");

class AuthorService {
  CreateAuthor = async (payload, files) => {
    const { authorName, bio } = payload;
    if (files) {
      payload.authorImage = convertUrlBook(files[0].filename);
    }
    const data = await authorModel.create({
      authorName: authorName,
      bio: bio,
      authorImage: payload.authorImage,
    });

    if (!data) throw new BadRequestError("Cant create author");
    return data;
  };

  GetAuthor = async (slug) => {
    const data = await authorModel.findOne({ slug: slug });
    if (!data) throw new BadRequestError("Cant find author");

    return data;
  };

  GetAllAuthors = async (page, limit) => {
    const { limitNumber, skip } = pagination(page, limit);
    console.log(page, limit);
    const data = await authorModel.find().skip(skip).limit(limitNumber);
    if (!data) throw new BadRequestError("Can get all authors");
    return data;
  };

  EditAuthor = async (slug, payload, files = null) => {
    if (!slug) throw new BadRequestError("Cant edit author");
    const holderAuthor = await authorModel.findOne({ slug: slug });
    if (!holderAuthor) throw new BadRequestError("Cant edit author 2");

    if (files && files.length > 0) {
      payload.authorImage = convertUrlBook(files[0].filename);
    }

    Object.assign(holderAuthor, payload);

    const data = await holderAuthor.save();
    if (!data) throw new BadRequestError("Cant edit 3");

    return data;
  };

  DeleteAuthor = async (slug) => {
    if (!slug) throw new BadRequestError("Cant delete 1");

    const holderAuthor = await authorModel.findOne({ slug: slug });
    if (!holderAuthor) throw new BadRequestError("Cant delete 2");

    const data = await authorModel.deleteOne({ _id: holderAuthor._id });
    if (data.deletedCount == 0) throw new BadRequestError("Cant delete 3");
    return data;
  };
}

module.exports = new AuthorService();
