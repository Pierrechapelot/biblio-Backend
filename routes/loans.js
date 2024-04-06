var express = require("express");
var router = express.Router();

//Route pour créer un nouvel emprunt
router.post("/", async (req, res) => {
  const { book, userIdentifier, loanDate, dueDate } = req.body;
  const newLoan = new Loan({
    book,
    userIdentifier,
    loanDate,
    dueDate,
    returnDate: null,
    status: "loaned",
  });

  try {
    const savedLoan = await newLoan.save();
    res.status(201).json(savedLoan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour récupérer tous les emprunts
router.get("/", async (req, res) => {
  try {
    const loans = await Loan.find().populate("book");
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
