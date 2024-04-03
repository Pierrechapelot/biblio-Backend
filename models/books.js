const mongoose = require("mongoose");

const booksSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "authors",
    required: true,
  },
  genre: String,
  isbn: String,
  publicationDate: Date,
  description: String,
  available: Boolean,
});

const Book = mongoose.model("books", booksSchema);
module.exports = Book;
