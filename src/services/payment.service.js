const qs = require("qs");
const axios = require("axios");
const moment = require("moment");
const CryptoJS = require("crypto-js");
const { BadRequestError } = require("../core/error.response");
const config = {
  app_id: process.env.ZALOPAY_APP_ID || "2554",
  key1: process.env.ZALOPAY_KEY_1 || "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: process.env.ZALOPAY_KEY_2 || "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint:
    process.env.ZALOPAY_ENDPOINT_CREATE ||
    "https://sb-openapi.zalopay.vn/v2/create",
};

class PaymentService {
  payment = async () => {
    const embed_data = {
      //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
      // redirecturl: "https://phongthuytaman.com",
    };

    const items = ["Rat nhieu sach ne"];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: 50000,
      callback_url: `${process.env.NGROK_ENDPOINT}/v1/api/payment/callback`,
      description: `Phiếu thanh toán cho đơn hàng #${transID}`,
      bank_code: "",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const result = await axios.post(config.endpoint, null, { params: order });
    console.log(result);

    if (result.data.return_code !== 1) {
      throw new BadRequestError("Something went wrong!");
    }
    return result.data;
  };

  paymentCallBack = async (dataStr, reqMac) => {
    console.log(dataStr)
    console.log(reqMac)
    return { dataStr, reqMac };
  };

  OrderStatus = async () => {
    return "OrderStatus";
  };
}

module.exports = new PaymentService();
