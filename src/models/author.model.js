const { model, Schema } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Author";
const COLLECTION_NAME = "Authors";

const AuthorSchema = new Schema(
  {
    authorName: {
      type: String,
      required: true,
    },
    authorImage: {
      type: String,
    },
    slug: String,
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

AuthorSchema.pre("save", async function (next) {
  if (this.isModified("authorName")) {
    let slug = slugify(this.authorName, { lower: true });
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

module.exports = model(DOCUMENT_NAME, AuthorSchema);
