const qs = require("qs");
const { convertToObjectIdMongose } = require("../utils/index");
const axios = require("axios");
const moment = require("moment");
const CryptoJS = require("crypto-js");
const { BadRequestError } = require("../core/error.response");
const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const bookModel = require("../models/book.model");
const config = {
  app_id: process.env.ZALOPAY_APP_ID,
  key1: process.env.ZALOPAY_KEY_1,
  key2: process.env.ZALOPAY_KEY_2,
  endpoint:
    process.env.ZALOPAY_ENDPOINT_CREATE ||
    "https://sb-openapi.zalopay.vn/v2/create",
};

class PaymentService {
  payment = async (payload, id, type) => {
    let data;
    if (type == "t") {
      data = await tranferType(payload, id, type);
    }

    if (type == "c") {
      data = await codType(payload, id);
    }
    for (var item of payload.items) {
      const holderBook = await bookModel.findOne({ _id: item.book });
      holderBook.quantity -= item.quantity;
      await holderBook.save();
    }
    return data;
  };

  paymentCallBack = async (dataStr, reqMac, type, payload) => {
    let data;
    if (type == "t") {
      data = await callbackTranferType(dataStr, reqMac);
    }

    if (type == "c" && payload) {
      data = await callbackCODType(payload);
    }
    // return { dataStr, reqMac };
    return data;
  };

  OrderStatus = async () => {
    return "OrderStatus";
  };
}

const callbackCODType = async (payload) => {
  return payload;
};

const callbackTranferType = async (dataStr, reqMac) => {
  dataStr = JSON.parse(dataStr);
  const embed_data = JSON.parse(dataStr.embed_data);
  const orderId = embed_data.orderId;
  const holderOrder = await orderModel.findOne({
    _id: orderId,
  });
  if (holderOrder) {
    holderOrder.orderStatus = true;
    await holderOrder.save();
  }
  // if (dataStr) {
  //   console.log(dataStr.embed_data);
  //   // const holderOrder = await orderModel.findOne({
  //   //   _id: dataStr.embed_data.order_id,
  //   // });
  //   console.log(holderOrder);
  // }
  // console.log(dataStr);
  return dataStr.app_user;
  // return 1;
};

const tranferType = async (payload, id, type) => {
  const orderId = payload.orderId;
  const embed_data = {
    redirecturl: "http://localhost:5173/payment-success",
    orderId: orderId,
  };
  const orderHolder = await orderModel.findOne({
    _id: convertToObjectIdMongose(orderId),
  });

  const items = payload.items;
  const transID = Math.floor(Math.random() * 999999);

  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: id.UserId,
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: payload.total,
    callback_url: `${process.env.NGROK_ENDPOINT}/v1/api/payment/callback?type=t`,
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

  orderHolder.orderStatus = false;
  orderHolder.paymentMethod = "T";
  orderHolder.addressTo = payload.payload.address;
  orderHolder.phoneReceive = payload.payload.phoneReceive;
  orderHolder.totalAmount = payload.payload.totalAmount;

  const holderCart = await cartModel.findOne({ user: id.UserId });
  if (!holderCart) throw new BadRequestError("Cant not dlt cart");
  await holderCart.deleteOne();

  await orderHolder.save();
  return result.data;
};

const codType = async (payload, id) => {
  const orderId = payload.orderId;

  const orderHolder = await orderModel.findOne({
    _id: convertToObjectIdMongose(orderId),
  });

  orderHolder.orderStatus = false;
  orderHolder.paymentMethod = "C";
  orderHolder.addressTo = payload.payload.address;
  orderHolder.phoneReceive = payload.payload.phoneReceive;
  orderHolder.totalAmount = payload.payload.totalAmount;

  const holderCart = await cartModel.findOne({ user: id.UserId });
  if (!holderCart) throw new BadRequestError("Can not delte cart");
  await holderCart.deleteOne();

  await orderHolder.save();

  return orderHolder;
};
module.exports = new PaymentService();
