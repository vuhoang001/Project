const addressService = require("../services/address.service");
const { SuccessResponse } = require("../core/success.response");

class AddressController {
  GetCode = async (req, res, next) => {
    const code = req.query.code;
    new SuccessResponse({
      message: "Get address by code",
      metadata: await addressService.GetAddress(code),
    }).send(res);
  };
}

module.exports = new AddressController();
