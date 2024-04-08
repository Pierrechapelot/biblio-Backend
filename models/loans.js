const mongoose = require("mongoose");

const loansSchema = mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "books" },
  userIdentifier: String,
  loanDate: Date,
  dueDate: Date,
  returnDate: Date,
  status: String
});

const Loan = mongoose.model("loans", loansSchema);
module.exports = Loan;
