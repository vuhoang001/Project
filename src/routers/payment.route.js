const express = require("express");
const router = express.Router();
const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");

const PaymentController = require("../controller/payment.controller");
const AsyncHandle = require("../helpers/AsyncHandle");
const { authentication } = require("../auth/authUtils");
const config = {
  app_id: process.env.ZALOPAY_APP_ID,
  key1: process.env.ZALOPAY_KEY_1,
  key2: process.env.ZALOPAY_KEY_2,
  endpoint:
    process.env.ZALOPAY_ENDPOINT_CREATE ||
    "https://sb-openapi.zalopay.vn/v2/create",
};
router.post("/callback", AsyncHandle(PaymentController.paymentCallBack));

router.post("/status-order", async (req, res) => {
  const { app_trans_id } = req.body;

  let postData = {
    app_id: config.app_id,
    app_trans_id, // Input your app_trans_id
  };

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    console.log(result.data);
    return res.status(200).json(result.data);
    /**
     * kết quả mẫu
      {
        "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
        "return_message": "",
        "sub_return_code": 1,
        "sub_return_message": "",
        "is_processing": false,
        "amount": 50000,
        "zp_trans_id": 240331000000175,
        "server_time": 1711857138483,
        "discount_amount": 0
      }
    */
  } catch (error) {
    console.log("lỗi");
    console.log(error);
  }
});
router.use(authentication);
router.post("/", AsyncHandle(PaymentController.payment));

module.exports = router;
