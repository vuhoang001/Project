const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const OrderSchema = new Schema(
  {
    products: [
      {
        book: {
          type: Schema.Types.ObjectId,
          ref: "Book",
        },
        quantity: Number,
        price: Number,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
    orderStatus: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ["T", "C"],
    },
    addressTo: {
      type: String,
      default: "",
    },
    phoneReceive: {
      type: String,
      default: "",
    },
    totalAmount: {
      type: Number,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, OrderSchema);
