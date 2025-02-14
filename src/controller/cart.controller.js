const { SuccessResponse } = require("../core/success.response");
const cartService = require("../services/cart.service");

class CartController {
  list = async (req, res, next) => {
    const IdUser = req.user.UserId;
    new SuccessResponse({
      message: "List cart",
      metadata: await cartService.List(IdUser),
    }).send(res);
  };

  AddProducts = async (req, res, next) => {
    const id = req.user.UserId;
    const payload = req.body;
    const { a } = req.query;
    new SuccessResponse({
      message: "Add to cart",
      metadata: await cartService.AddProduct(payload, id, a),
    }).send(res);
  };

  RemoveProducts = async (req, res, next) => {
    const id = req.user.UserId;
    const ids = req.body;
    new SuccessResponse({
      message: "Remove product",
      metadata: await cartService.removeProducts(ids, id),
    }).send(res);
  };
}

module.exports = new CartController();
