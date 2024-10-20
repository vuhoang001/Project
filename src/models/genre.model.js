const { Schema, model } = require("mongoose");
const slugify = require("slugify");
const DOCUMENT_NAME = "Genre";
const COLLECTION_NAME = "Genres";

const GenreSchema = new Schema(
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

GenreSchema.pre("save", async function (next) {
  if (this.isModified("genreName")) {
    let slug = slugify(this.genreName, { lower: true });
    let uniqueSlug = slug;
    let count = 1;

    while (await this.constructor.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }
    this.slug = uniqueSlug;
  }
  next();
});
module.exports = model(DOCUMENT_NAME, GenreSchema);
