var express = require("express");
var router = express.Router();

// const fetch = require("node-fetch");
const Author = require("../models/authors");
const Book = require("../models/books");

// Route pour créer un nouvel auteur :
router.post("/", async (req, res) => {
  const { lastName, firstName } = req.body;
  const author = new Author({
    lastName,
    firstName,
  });

  try {
    const newAuthor = await author.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour récupérer tous les auteurs
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour récupérer un auteur par ID
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour mettre à jour un auteur par ID
router.put("/:id", async (req, res) => {
  try {
    const { lastName, firstName } = req.body;
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      { lastName, firstName },
      { new: true }
    );
    if (!author) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }
    res.json(author);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour supprimer un auteur par ID
router.delete("/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Auteur non trouvé" });
    }
    res.json({ message: "Auteur supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour récupérer les livres d'un auteur donné
router.get('/:id/books', async (req, res) => {
    try {
        const books = await Book.find({ author: req.params.id });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
