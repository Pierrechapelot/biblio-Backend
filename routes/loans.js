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

// récupérer un emprunt par ID
router.get("/:id", async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate("book");
    if (!loan) return res.status(404).json({ message: "Emprunt non trouvé" });
    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mettre à jour un emprunt par ID

router.put("/:id", async (req, res) => {
  const { returnDate, status } = req.body;

  try {
    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      { returnDate, status },
      { new: true }
    );
    if (!updatedLoan)
      return res.status(404).json({ message: "Emprunt non trouvé" });
    res.json(updatedLoan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Supprimer un emprunt par id
router.delete("/:id", async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) return res.status(404).json({ message: "Emprunt non trouvé" });
    res.json({ message: "Emprunt supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Récupération de la liste des emprunts en cours
router.get("/", async (req, res) => {
  let query = {};
  if (req.query.status) {
    query.status = req.query.status;
  }
  try {
    const loans = await Loan.find(query).populate("book");
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Recherche des empruntspar utilisateur ou par livre
router.get("/", async (req, res) => {
  let query = {};
  if (req.query.userIdentifier) {
    query.userIdentifier = req.query.userIdentifier;
  }
  if (req.query.book) {
    query.book = req.query.book;
  }
  try {
    const loans = await Loan.find(query).populate("book");
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;