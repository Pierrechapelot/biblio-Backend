var express = require("express");
var router = express.Router();

const fetch = require("node-fetch");
const Book = require("../models/books");

router.post("/", async (req, res) => {
  const { isbn } = req.body;

  try {
    // Construit l'URL de requête pour Google Books API en utilisant l'ISBN
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

    // Fait une requête à Google Books API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Erreur lors de la requête à Google Books API: ${response.statusText}`
      );
    }
    const data = await response.json();

    // Extrait la description du premier livre trouvé, ou utilise une description par défaut
    const description =
      data.items?.[0]?.volumeInfo?.description || "Description non disponible.";

    // Crée un nouvel objet livre avec la description récupérée
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      isbn: isbn,
      publicationDate: req.body.publicationDate,
      description: description,
      available: req.body.available,
    });

    // Sauvegarde le livre dans la base de données
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    // Gère à la fois les erreurs de la requête API et les erreurs de sauvegarde du livre
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
