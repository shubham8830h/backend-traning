const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookName: String,
    authorName: String,
    category: {
      type: String,
    },
    year: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("bookInfo", bookSchema);
