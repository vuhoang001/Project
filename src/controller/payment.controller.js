const paymentService = require("../services/payment.service");
const { SuccessResponse } = require("../core/success.response");

class PaymentController {
  payment = async (req, res, next) => {
    new SuccessResponse({
      message: "Payment success!",
      metadata: await paymentService.payment(),
    }).send(res);
  };

  paymentCallBack = async (req, res, next) => {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;
    new SuccessResponse({
      message: "Payment callback",
      metadata: await paymentService.paymentCallBack(dataStr, reqMac),
    }).send(res);
  };

  orderStatus = async (req, res, next) => {
    new SuccessResponse({
      message: "Order status",
      metadata: await paymentService.OrderStatus(),
    }).send(res);
  };
}

module.exports = new PaymentController();
