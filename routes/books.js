var express = require("express");
var router = express.Router();

// const fetch = require("node-fetch");
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

router.post("/", async (req, res) => {
  const { title, genre, isbn, publicationDate, description, available } =
    req.body;
  let { firstName, lastName } = req.body;

  //   On normalise les noms d'auteurs
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

    // Maintenant que l'auteur est garanti d'exister, créer le livre
    const book = new Book({
      title,
      author: author._id, // Utiliser l'ID de l'auteur existant ou nouvellement créé
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

// router.post("/", async (req, res) => {
//   const { isbn } = req.body;

//   try {
//     // Construit l'URL de requête pour Google Books API en utilisant l'ISBN
//     const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

//     // Fait une requête à Google Books API
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(
//         `Erreur lors de la requête à Google Books API: ${response.statusText}`
//       );
//     }
//     const data = await response.json();

//     // Extrait la description du premier livre trouvé, ou utilise une description par défaut
//     const description =
//       data.items?.[0]?.volumeInfo?.description || "Description non disponible.";

//     // Crée un nouvel objet livre avec la description récupérée
//     const book = new Book({
//       title: req.body.title,
//       author: req.body.author,
//       genre: req.body.genre,
//       isbn: isbn,
//       publicationDate: req.body.publicationDate,
//       description: description,
//       available: req.body.available,
//     });

//     // Sauvegarde le livre dans la base de données
//     const newBook = await book.save();
//     res.status(201).json(newBook);
//   } catch (err) {
//     // Gère à la fois les erreurs de la requête API et les erreurs de sauvegarde du livre
//     res.status(400).json({ message: err.message });
//   }
// });

module.exports = router;
