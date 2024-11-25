const keyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

const { BadRequestError } = require("../core/error.response");

class KeyTokenService {
  static createKeys = async ({ user, refreshToken }) => {
    const keys = await keyTokenModel.findOneAndUpdate(
      { user: user._id },
      { refreshToken },
      { new: true, upsert: true }
    );
    if (!keys) throw new BadRequestError("Error: Cant create or update keys");
    return keys;
  };

  static findById = async (id) => {
    return await keyTokenModel.findOne({ user: id });
  };

  static removeTokenById = async (id) => {
    return await keyTokenModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
  };

  static removeTokenByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({
      user: userId,
    });
  };
}

module.exports = KeyTokenService;
