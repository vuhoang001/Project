const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const CartSchema = new Schema(
  {
    products: [
      {
        book: {
          type: Schema.Types.ObjectId,
          ref: "Book",
        },
        quantity: Number,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, CartSchema);
