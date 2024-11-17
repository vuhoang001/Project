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
    const holderAccount = await getAccountById(decodedUser.UserId);
    if (!holderAccount) throw new AuthFailureError("Invalid refresh token!");
    req.user = decodedUser;
    req.refreshToken = refreshToken;
  }

  if (accessToken) {
    const decodedUser = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const holderAccount = await getAccountById(decodedUser.UserId);
    if (!holderAccount) throw new AuthFailureError("Invalid access token!");
    req.user = decodedUser;
  }
  next();
});

module.exports = {
  createTokensPair,
  authentication,
};
