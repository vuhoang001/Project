const userModel = require("../models/users.model");

class UserService {
  static findByEmail = async (email) => {
    return userModel.findOne({ email });
  };
}

module.exports = UserService;
