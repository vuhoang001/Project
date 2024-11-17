const genreModel = require("../models/genre.model");
const { BadRequestError } = require("../core/error.response");
const { pagination } = require("../utils/index");

class GenreService {
  CreateGenre = async (payload) => {
    const data = await genreModel.create({
      genreName: payload.genreName,
      genreDescription: payload.genreDescription,
    });
    if (!data) throw new BadRequestError("Can create genre");
    return data;
  };

  GetAllGenres = async (page = 1, limit = 100) => {
    const { limitNumber, skip } = pagination(page, limit);
    const data = genreModel.find().skip(skip).limit(limitNumber);
    if (!data) throw new BadRequestError("Cant get all genre");
    return data;
  };

  GetGenre = async (slug, page, limit) => {
    if (!slug) throw new BadRequestError("Cant get genre 1");

    const data = await genreModel.findOne({ slug: slug });
    if (!data) throw new BadRequestError("Cant get genre 2");

    return data;
  };

  EditGenre = async (slug, payload) => {
    if (!slug) throw new BadRequestError("Cant edit genre");

    const holderGenre = await genreModel.findOne({ slug: slug });
    if (!holderGenre) throw new BadRequestError("Cant edit genre 2 ");

    Object.assign(holderGenre, payload);

    const data = await holderGenre.save();
    if (!data) throw new BadRequestError("Cant edit genre 3");

    return data;
  };

  DeleteGenre = async (slug) => {
    if (!slug) throw new BadRequestError("Cant delete genre");

    const holderGenre = await genreModel.findOne({ slug: slug });
    if (!holderGenre) throw new BadRequestError("Can delete genre");

    const data = await genreModel.deleteOne({ _id: holderGenre._id });
    if (data.deletedCount == 0)
      throw new BadRequestError("Cant delete genre 3");
    return data;
  };
}

module.exports = new GenreService();
