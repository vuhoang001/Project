const { SuccessResponse } = require("../core/success.response");
const orderService = require("../services/order.service");

class OrderController {
  checkout = async (req, res, next) => {
    const id = req.user.UserId;
    new SuccessResponse({
      message: "Create Order",
      metadata: await orderService.Checkout(id),
    }).send(res);
  };

  GetOrder = async (req, res, next) => {
    const id = req.user.UserId;
    new SuccessResponse({
      message: "Get order",
      metadata: await orderService.GetOrder(id),
    }).send(res);
  };

  GetOrderByUser = async (req, res, next) => {
    const id = req.user.UserId;
    new SuccessResponse({
      message: "GetOrderByUser",
      metadata: await orderService.GetOrderByUsr(id),
    }).send(res);
  };

  GetOrders = async (req, res, next) => {
    new SuccessResponse({
      message: "Get orders",
      metadata: await orderService.GetOrders(),
    }).send(res);
  };
}

module.exports = new OrderController();
