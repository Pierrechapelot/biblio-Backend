const mongoose = require("mongoose");

const booksSchema = mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "authors" },
  genre: String,
  isbn: String,
  publicationDate: Date,
  description: String,
  available: Boolean,
});

const Book = mongoose.model("books", booksSchema);
module.exports = Book;
