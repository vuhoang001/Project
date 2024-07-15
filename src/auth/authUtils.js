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
  const userId = req.headers[HEADER.CLIENT_ID];
  const refreshToken = req.headers[HEADER.REFRESHTOKEN];
  const authHeader = req.headers["authorization"].split(" ")[1];

  const keys = await keyTokenModel.findOne({
    user: userId,
  });

  if (authHeader) {
    const decodeUser = jwt.verify(authHeader, keys.publicKey);
    if (decodeUser.UserId !== userId)
      throw new AuthFailureError("Invalid accessToken");
    req.user = decodeUser;
  }

  if (refreshToken) {
    const decodeRT = jwt.verify(refreshToken, keys.privateKey);
    if (decodeRT.UserId !== userId)
      throw new AuthFailureError("Invalid refreshToken");
    req.refreshToken = refreshToken;
    console.log("refreshToken", refreshToken);
  }
  next();
});

module.exports = {
  createTokensPair,
  authentication,
};
