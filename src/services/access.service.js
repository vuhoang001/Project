const {
  BadRequestError,
  NotfoundError,
  AuthFailureError,
} = require("../core/error.response");
const UserModel = require("../models/users.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("../services/keyToken.service");
const UserService = require("../services/user.service");
const { createTokensPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index");
const { sendMail } = require("../config/nodemailer.config");
const ForgetPasswordModel = require("../models/forgetPassword.model");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    const holderUser = await UserModel.findOne({ email });
    if (holderUser)
      throw new BadRequestError("Error: Account already registed!");

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: passwordHash,
    });

    if (!newUser)
      throw new BadRequestError(
        "Error: Something went wrong! Cant create account!"
      );

    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    const keys = await KeyTokenService.createKeys({
      user: newUser,
      publicKey,
      privateKey,
    });

    if (!keys)
      throw new BadRequestError(
        "Error: Something went wrong! Cant create keys!"
      );

    const tokens = await createTokensPair(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      publicKey,
      privateKey
    );

    return {
      code: "201",
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newUser,
        }),
        tokens,
      },
    };
  };

  static login = async ({ email, password }) => {
    const holderUser = await UserModel.findOne({
      email,
    });
    if (!holderUser) throw new NotfoundError("Username or password is wrong");

    const match = await bcrypt.compare(password, holderUser.password);

    if (!match) throw new NotfoundError("Username or password is wrong");

    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokensPair(
      {
        UserId: holderUser._id,
        email,
      },
      publicKey,
      privateKey
    );

    if (!tokens)
      throw new BadRequestError("Something went wrong! Cant create tokens");

    const keyStore = await KeyTokenService.createKeys({
      user: holderUser,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!keyStore)
      throw new BadRequestError("Error: cant create or update keyStore");

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: holderUser,
      }),
      tokens,
    };
  };

  static logout = async (user) => {
    const id = user.UserId;
    const delKey = await KeyTokenService.removeTokenByUserId(id);
    return delKey;
  };

  static refreshTokenHandle = async (user, refreshToken) => {
    console.log("refreshToken", refreshToken);
    console.log("user", user);
    const userId = user.UserId;
    const email = user.email;
    const keyStore = await KeyTokenService.findById(userId);
    if (!keyStore) throw new AuthFailureError("Cant find UID");

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.removeTokenByUserId(userId);
      throw new ForbiddenError("Something went wrong! Please relogin");
    }

    const foundUser = await UserService.findByEmail(email);

    if (!foundUser) throw new AuthFailureError("Account isnt registed");

    const tokens = await createTokensPair(
      {
        UserId: foundUser._id,
        email,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );

    const holderTokens = await KeyTokenService.findById(foundUser._id);
    const res = await holderTokens.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    if (!res) throw new BadRequestError("ERROR:: cant set and update res");

    return {
      user: {
        userId,
        email,
      },
      tokens: tokens,
    };
  };

  static handleOTP = async (payload) => {
    const email = payload.email;

    const holderUser = await UserService.findByEmail(email);
    if (!holderUser) throw new AuthFailureError("Invalid email!");

    const resetToken = crypto.randomBytes(16).toString("hex");

    const hash = await bcrypt.hash(resetToken, 10);

    const forgetPassword = await ForgetPasswordModel.create({
      email: email,
      token: hash,
      expireAt: Date.now(),
    });

    if (!forgetPassword) throw new BadRequestError("Cant create OTP");
    const link = `http://localhost:3000/v1/api/passwordReset?token=${resetToken}&email=${email}`;
    sendMail(email, link);
    return link;
  };

  static resetPassword = async (payload, resetToken, email) => {
    const password = payload.password;
    const passwordResetToken = await ForgetPasswordModel.findOne({ email });
    if (!passwordResetToken) {
      throw new BadRequestError("Invalid or expired password reset token");
    }

    const isValid = await bcrypt.compare(resetToken, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token2");
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await UserModel.updateOne(
      { email: email },
      { $set: { password: hash } },
      { new: true }
    );

    return user;
  };
}

module.exports = AccessService;
