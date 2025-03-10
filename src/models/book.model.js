const { model, Schema } = require("mongoose");
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = "Book";
const COLLECTION_NAME = "Books";

const BookSchema = new Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    authorBook: {
      type: Schema.Types.ObjectId,
      ref: "Author",
    },
    imageBook: {
      type: String,
    },
    genre: {
      type: Schema.Types.ObjectId,
      ref: "Genre",
    },
    bookDescription: {
      type: String,
      default: "",
    },
    translater: {
      type: String,
      default: "unknow",
    },
    summary: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    totalPages: {
      type: Number,
      default: 0,
    },
    importPrice: {
      type: Number,
      default: 0,
    },
    releaseTime: {
      type: Date,
      default: Date.now,
    },
    size: {
      type: String,
      default: "36x36",
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    discount: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

BookSchema.pre("save", async function (next) {
  if (this.isModified("bookName")) {
    let slug = slugify(this.bookName, { lower: true });
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

module.exports = model(DOCUMENT_NAME, BookSchema);
