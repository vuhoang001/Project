const addressService = require("../services/address.service");
const { SuccessResponse } = require("../core/success.response");

class AddressController {
  GetCities = async (req, res, next) => {
    new SuccessResponse({
      message: "Get address by code",
      metadata: await addressService.GetCites(),
    }).send(res);
  };

  GetDistrict = async (req, res, next) => {
    const code = req.params.code;
    new SuccessResponse({
      message: "Get district success",
      metadata: await addressService.GetDistrict(code),
    }).send(res);
  };

  GetWard = async (req, res, next) => {
    const code = req.params.code;
    new SuccessResponse({
      message: "Get ward",
      metadata: await addressService.GetWard(code),
    }).send(res);
  };
}

module.exports = new AddressController();
