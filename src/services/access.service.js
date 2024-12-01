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
const { getInfoData, convertUrlBook } = require("../utils/index");
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

    // const publicKey = crypto.randomBytes(64).toString("hex");
    // const privateKey = crypto.randomBytes(64).toString("hex");

    // const keys = await KeyTokenService.createKeys({
    //   user: newUser,
    //   publicKey,
    //   privateKey,
    // });

    // if (!keys)
    //   throw new BadRequestError(
    //     "Error: Something went wrong! Cant create keys!"
    //   );

    // const tokens = await createTokensPair(
    //   {
    //     userId: newUser._id,
    //     email: newUser.email,
    //   },
    //   publicKey,
    //   privateKey
    // );

    return {
      code: "201",
      metadata: {
        information: getInfoData({
          fields: ["_id", "name", "email"],
          object: newUser,
        }),
        // tokens,
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

    const tokens = await createTokensPair({
      UserId: holderUser._id,
      email: holderUser.email,
    });

    if (!tokens)
      throw new BadRequestError("Something went wrong! Cant create tokens");

    const keyStore = await KeyTokenService.createKeys({
      user: holderUser,
      refreshToken: tokens.refreshToken,
    });

    if (!keyStore)
      throw new BadRequestError("Error: cant create or update keyStore");

    return {
      information: getInfoData({
        fields: ["_id", "name", "email", "roles"],
        object: holderUser,
      }),
      accessToken: tokens.accessToken,
      atokenExp: tokens.atokenExp,
      refreshToken: tokens.refreshToken,
      rtokenExp: tokens.rtokenExp,
    };
  };

  static logout = async (user) => {
    const id = user.UserId;
    const delKey = await KeyTokenService.removeTokenByUserId(id);
    return delKey;
  };

  static getMe = async (id) => {
    const data = await UserModel.findOne({ _id: id }).select("-password");
    if (!data) throw new BadRequestError("Somethignwentwr");
    return data;
  };

  static refreshTokenHandle = async (user, refreshToken) => {
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

  static GetUserById = async (id) => {
    const data = await UserModel.findOne({ _id: id });
    if (!data) throw new BadRequestError("Swr");
    return data;
  };

  static UpdateUser = async (payload, user) => {
    const id = user.UserId;
    console.log(payload);
    const updateUser = await UserModel.findOne({ _id: id });
    if (!updateUser) throw new BadRequestError("Can find user");
    Object.assign(updateUser, payload);
    updateUser.roles = "C";
    const res = await updateUser.save();
    return res;
  };

  static changePassword = async (payload, User) => {
    let { oldPassword, newPassword } = payload;
    const id = User.UserId;

    const holderUser = await UserModel.findOne({ _id: id });
    if (!holderUser) throw new BadRequestError("Cant find holderUser");

    const match = await bcrypt.compare(oldPassword, holderUser.password);
    if (!match)
      throw new BadRequestError("Nhập sai mật khẩu vui lòng nhập lại !");

    newPassword = await bcrypt.hash(newPassword, 10);
    if (!newPassword)
      throw new BadRequestError("Some thing went wrong with bcrypt");

    holderUser.password = newPassword;
    holderUser.roles = "C";

    await holderUser.save();
    return 1;
  };

  static updateImage = async (files, User) => {
    const id = User.UserId;

    const holderUser = await UserModel.findOne({ _id: id });
    if (!holderUser) throw new BadRequestError("Can not find holderUser");

    if (!files) throw new BadRequestError("Vui lòng nhập ảnh!");

    holderUser.thumbnail = convertUrlBook(files[0].filename);

    if (!holderUser.thumbnail) throw new BadRequestError("Không lưu được ảnh");

    await holderUser.save();
    return 1;
  };
}

module.exports = AccessService;
