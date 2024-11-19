const { Schema, model } = require("mongoose");
const slugify = require("slugify");
const DOCUMENT_NAME = "Content";
const COLLECTION_NAME = "Contents";

const ContentSchema = new Schema(
  {
    genreName: {
      type: String,
      required: true,
    },
    genreDescription: {
      type: String,
    },
    slug: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, ContentSchema);
