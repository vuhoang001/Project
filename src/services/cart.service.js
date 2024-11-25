const cartModel = require("../models/cart.model");
const { BadRequestError } = require("../core/error.response");
const { convertToObjectIdMongose } = require("../utils/index");

class CartService {
  List = async (ID) => {
    const holderData = await cartModel
      .findOne({ user: ID })
      .populate("products.book");
    if (!holderData) {
      const data = await cartModel.create({
        user: convertToObjectIdMongose(ID),
      });
      if (!data) throw new BadRequestError("Somethingwentwrong");
      return data;
    }

    return holderData;
  };

  AddProduct = async (payload, id, a) => {
    let cart = await cartModel.findOne({ user: id });
    if (!cart) {
      cart = new cartModel({
        user: convertToObjectIdMongose(id),
        products: [],
      });
    }

    for (const item of payload) {
      const existingItem = cart.products.find((product) => {
        return product.book.toString() == item.productId;
      });

      if (existingItem) {
        if (a == 1) {
          existingItem.quantity += item.quantity;
        } else {
          existingItem.quantity = item.quantity;
        }
      } else {
        cart.products.push({
          book: item.productId,
          quantity: item.quantity,
        });
      }
    }

    await cart.save();
    return cart;
  };

  removeProducts = async (ids, idUser) => {
    const cart = await cartModel.findOne({ user: idUser });
    if (!cart) throw new BadRequestError("Something went wrong");

    for (let i = 0; i < cart.products.length; i++) {
      for (let j = 0; j < ids.length; j++) {
        if (ids[j].toString() == cart.products[i].book) {
          cart.products.splice(i, 1);
          i--;
          break;
        }
      }
    }
    await cart.save();

    return cart;
  };

  AddToCart = async (payload, id) => {};
}

module.exports = new CartService();
