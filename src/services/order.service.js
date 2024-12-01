const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const { BadRequestError } = require("../core/error.response");

class OrderService {
  Checkout = async (idUser) => {
    const cart = await cartModel.findOne({ user: idUser });
    if (!cart || cart.products.length === 0) {
      throw new BadRequestError("Something went wrong");
    }

    const existingOrder = await orderModel.findOne({
      user: idUser,
      cart: cart._id,
    });

    if (existingOrder) {
      existingOrder.products = cart.products;

      await existingOrder.save();
      return existingOrder;
    }

    const order = new orderModel({
      user: idUser,
      products: cart.products,
      cart: cart._id,
    });

    await order.save();

    return order;
  };

  GetOrder = async (idUser) => {
    const cart = await cartModel.findOne({ user: idUser });
    if (!cart) throw new BadRequestError("Something went wrong");

    const data = orderModel
      .findOne({ orderStatus: false, cart: cart._id.toString() })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "products.book",
        select: "bookName imageBook price discount ",
      });
    if (!data) throw new BadRequestError("Something went wrong");
    return data;
  };

  GetOrderByUsr = async (idUser) => {
    const cart = await cartModel.find({ user: idUser });
    if (!cart) throw new BadRequestError("Cant get cart");

    const data = orderModel
      .find()
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "products.book",
        select: "bookName imageBook price discount ",
      });

    if (!data) throw new BadRequestError("Cant get data");
    return data;
  };

  GetOrders = async () => {
    const data = orderModel
      .find()
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "products.book",
        select: "bookName imageBook price",
      });
    if (!data) throw new BadRequestError("Something went wrong");
    return data;
  };
}

module.exports = new OrderService();
