const authorModel = require("../models/author.model");
const { BadRequestError } = require("../core/error.response");
const { pagination } = require("../utils/index");
const { uploadImageFromLocalFiles } = require("../helpers/cloudinary");

class AuthorService {
  CreateAuthor = async (payload, files) => {
    const { authorName, bio } = payload;
    const image = await uploadImageFromLocalFiles(files);
    console.log(image);
    if (image) {
      payload.authorImage = image[0].thumb_url;
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
    console.log(limitNumber, skip);
    const data = await authorModel.find().skip(skip).limit(limitNumber);
    if (!data) throw new BadRequestError("Can get all authors");
    return data;
  };

  EditAuthor = async (slug, payload, files) => {
    if (!slug) throw new BadRequestError("Cant edit author");
    const holderAuthor = await authorModel.findOne({ slug: slug });
    if (!holderAuthor) throw new BadRequestError("Cant edit author 2");

    const image = await uploadImageFromLocalFiles(files);
    if (image) {
      payload.authorImage = image[0].thumb_url;
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

  Upload = async (files) => {
    const res = await uploadImageFromLocalFiles(files);
    console.log(res.thumb_url);
    return res;
  };
}

module.exports = new AuthorService();
