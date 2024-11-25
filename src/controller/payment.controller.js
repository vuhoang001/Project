const paymentService = require("../services/payment.service");
const { SuccessResponse } = require("../core/success.response");

class PaymentController {
  payment = async (req, res, next) => {
    const payload = req.body;
    const id = req.user;
    const type = req.query.type;
    new SuccessResponse({
      message: "Payment success!",
      metadata: await paymentService.payment(payload, id, type),
    }).send(res);
  };

  paymentCallBack = async (req, res, next) => {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;
    const type = req.query.type;
    new SuccessResponse({
      message: "Payment callback",
      metadata: await paymentService.paymentCallBack(dataStr, reqMac, type),
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
