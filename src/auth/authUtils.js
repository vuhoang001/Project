const jwt = require("jsonwebtoken");

const { AuthFailureError, BadRequestError } = require("../core/error.response");

const AsyncHandle = require("../helpers/AsyncHandle");
const keyTokenModel = require("../models/keyToken.model");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const createTokensPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    return { accessToken, refreshToken };
  } catch (err) {
    return err;
  }
};

const authentication = AsyncHandle(async (req, res, next) => {
  const bearer = req.headers[HEADER.AUTHORIZATION];
  const refreshToken = req.headers[HEADER.REFRESHTOKEN];
  let accessToken;
  if (bearer) accessToken = bearer.split(" ")[1];
  if (refreshToken) {
    const decodeUser = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const holderAccount = await getUserById(decodeUser.UserId);
    if (!holderAccount)
      throw new AuthFailureError("Error: Invalid refresh token !");

    req.user = holderAccount;
    req.refreshToken = refreshToken;
  }

  if (accessToken) {
    try {
      const decodeUser = jwt.verify(accessToken, process.env.ACCESS_SECRET);
      const account = await getUserById(decodeUser.UserId);
      if (!account) throw new AuthFailureError("Error: Invalid access token!");
      req.user = account;
    } catch (err) {
      console.log(err);
    }
  }
  next();
});

module.exports = {
  createTokensPair,
  authentication,
};
