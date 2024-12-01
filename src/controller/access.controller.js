const AccessService = require("../services/access.service");
const { SuccessResponse, OK } = require("../core/success.response");

class AccessController {
  signUp = async (req, res, next) => {
    new SuccessResponse({
      message: "Registed success!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  UpdateUser = async (req, res, next) => {
    const user = req.user;
    new SuccessResponse({
      message: "update success",
      metadata: await AccessService.UpdateUser(req.body, user),
    }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login success!",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logOut = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout success!",
      metadata: await AccessService.logout(req.user),
    }).send(res);
  };

  refreshTokenHandle = async (req, res, next) => {
    new SuccessResponse({
      message: "refreshTokenHandle success!",
      metadata: await AccessService.refreshTokenHandle(
        req.user,
        req.refreshToken
      ),
    }).send(res);
  };

  handleOTP = async (req, res, next) => {
    new SuccessResponse({
      message: "handleOTP success!",
      metadata: await AccessService.handleOTP(req.body),
    }).send(res);
  };

  getMe = async (req, res, next) => {
    const id = req.user.UserId;
    new SuccessResponse({
      message: "Get me",
      metadata: await AccessService.getMe(id),
    }).send(res);
  };

  resetPassword = async (req, res, next) => {
    const resetToken = req.query.token;
    const email = req.query.email;
    new SuccessResponse({
      message: "handleOTP success!",
      metadata: await AccessService.resetPassword(req.body, resetToken, email),
    }).send(res);
  };

  changePassword = async (req, res, next) => {
    const user = req.user;
    new SuccessResponse({
      message: "Change password",
      metadata: await AccessService.changePassword(req.body, user),
    }).send(res);
  };

  updateImage = async (req, res, next) => {
    const user = req.user;
    const { files } = req;
    new SuccessResponse({
      message: "Change image success",
      metadata: await AccessService.updateImage(files, user),
    }).send(res);
  };
}

module.exports = new AccessController();
