const addressModel = require("../models/address.model");

class AddressService {
  GetAddress = async (code) => {
    const res = code
      ? await addressModel.find({ Code: code })
      : await addressModel.find({});
    return res;
  };
}

module.exports = new AddressService();
