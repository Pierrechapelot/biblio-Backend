var express = require("express");
var router = express.Router();

const fetch = require("node-fetch");
const Book = require("../models/books");
const Author = require("../models/authors");

// Fonction pour normaliser les prenoms et noms d'auteurs
function normalizeName(name) {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
// Route pour créer un nouveau livre
router.post("/", async (req, res) => {
  const { title, genre, isbn, publicationDate, description, available } =
    req.body;
  let { firstName, lastName } = req.body;

  // Normaliser les noms d'auteurs
  const normalizedFirstName = normalizeName(firstName);
  const normalizedLastName = normalizeName(lastName);

  try {
    // Vérifier si l'auteur existe déjà avec les noms normalisés
    let author = await Author.findOne({
      firstName: { $regex: new RegExp("^" + normalizedFirstName + "$", "i") },
      lastName: { $regex: new RegExp("^" + normalizedLastName + "$", "i") },
    });

    // Si l'auteur n'existe pas, le créer
    if (!author) {
      author = new Author({ firstName, lastName });
      await author.save();
    }

    // Vérifier si le livre existe déjà en utilisant le titre et l'ISBN comme critères uniques
    const existingBook = await Book.findOne({ title, isbn });

    // Si le livre existe déjà, renvoyer un message d'erreur
    if (existingBook) {
      return res.status(409).json({ message: "Le livre existe déjà." });
    }

    // Connexion à google book API pour la description
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    const description = data.items?.[0]?.volumeInfo?.description || "Description non disponible.";


    // Créer le livre si ce n'est pas un doublon
    const book = new Book({
      title,
      author: author._id,
      genre,
      isbn,
      publicationDate,
      description,
      available,
    });

    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour récupérer tous les livres
router.get("/", (req, res) => {
  Book.find()
    .populate("author")
    .then((books) => res.json(books))
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Route pour récupérer un livre par son ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author");
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour Mettre à jour un livre par ID
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      genre,
      isbn,
      publicationDate,
      description,
      available,
      author,
    } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, genre, isbn, publicationDate, description, available, author },
      { new: true }
    ).populate("author");
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Route pour supprimer un livre par ID
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour Recherche de livres par titre, auteur, ou genre
router.get("/search", async (req, res) => {
  const query = {};
  if (req.query.title) query.title = { $regex: req.query.title, $options: "i" };
  if (req.query.genre) query.genre = { $regex: req.query.genre, $options: "i" };
  if (req.query.author) query["author"] = req.query.author; // Pour une recherche simple basée sur l'ObjectId de l'auteur

  try {
    const books = await Book.find(query).populate("author");
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
