const mongoose = require("mongoose");

const authorsSchema = mongoose.Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  birthDate: Date,
  nationality: String
});

const Author = mongoose.model("authors", authorsSchema);
module.exports = Author;