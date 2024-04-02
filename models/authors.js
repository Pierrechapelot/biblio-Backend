const mongoose = require("mongoose");

const authorsSchema = mongoose.Schema({
  lastName: String,
  firstName: String,
  birthDate: Date,
  nationality: String
});

const Author = mongoose.model("authors", authorsSchema);
module.exports = Author;