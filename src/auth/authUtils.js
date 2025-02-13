const jwt = require("jsonwebtoken");

const { AuthFailureError } = require("../core/error.response");
const userModel = require("../models/users.model");
// const UserServices = require("../services/access.service");

const AsyncHandle = require("../helpers/AsyncHandle");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const createTokensPair = async (payload) => {
  try {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "2 days",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7 days",
    });

    const rtokenTime = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const atokenTime = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return {
      accessToken,
      refreshToken,
      rtokenExp: rtokenTime.exp,
      atokenExp: atokenTime.exp,
    };
  } catch (err) {
    return err;
  }
};

const authentication = AsyncHandle(async (req, res, next) => {
  const Bearer = req.headers[HEADER.AUTHORIZATION];
  const refreshToken = req.headers[HEADER.REFRESHTOKEN];
  let accessToken;
  if (Bearer) accessToken = Bearer.split(" ")[1];

  if (!refreshToken && !accessToken)
    throw new AuthFailureError("Invalid tokenn");
  if (refreshToken) {
    const decodedUser = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const holderAccount = await userModel.findOne({ _id: decodedUser.UserId });
    if (!holderAccount) throw new AuthFailureError("Invalid refresh token!");
    req.user = decodedUser;
    req.refreshToken = refreshToken;
  }

  if (accessToken) {
    const decodedUser = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const holderAccount = await userModel.findOne({ _id: decodedUser.UserId });
    if (!holderAccount) throw new AuthFailureError("Invalid access token!");
    req.user = decodedUser;
  }
  next();
});

module.exports = {
  createTokensPair,
  authentication,
};
