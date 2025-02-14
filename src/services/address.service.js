const addressModel = require("../models/address.model");
const axios = require("axios");

class AddressService {
  GetCites = async () => {
    const { data } = await axios.get(
      "https://open.oapi.vn/location/provinces?page=0&size=65"
    );

    return data.data;
  };

  GetDistrict = async (code) => {
    const { data } = await axios.get(
      `https://open.oapi.vn/location/districts/${code}?page=0&size=50`
    );
    return data.data;
  };

  GetWard = async (code) => {
    const { data } = await axios.get(
      `https://open.oapi.vn/location/wards/${code}?page=0&size=200`
    );
    return data.data;
  };
}

module.exports = new AddressService();
