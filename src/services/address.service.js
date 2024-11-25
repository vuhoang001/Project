const addressModel = require("../models/address.model");
const axios = require("axios");

class AddressService {
  GetCites = async () => {
    const response = await axios.get("https://vapi.vnappmob.com/api/province");
    return response.data.results;
  };

  GetDistrict = async (code) => {
    const response = await axios.get(
      `https://vapi.vnappmob.com/api/province/district/${code}`
    );
    return response.data.results;
  };

  GetWard = async (code) => {
    const response = await axios.get(
      `https://vapi.vnappmob.com/api/province/ward/${code}`
    );
    return response.data.results;
  };
}

module.exports = new AddressService();
