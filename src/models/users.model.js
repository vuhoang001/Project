const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: String,
      enum: ["A", "C"],
      default: "C",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, UserSchema);
