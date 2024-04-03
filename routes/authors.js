var express = require("express");
var router = express.Router();

// const fetch = require("node-fetch");
const Author = require("../models/authors");

// Créer un nouvel auteur :
router.post("/", async (req, res) => {
  const { lastName, firstName} = req.body;
  const author = new Author({
    lastName,
    firstName,
    // birthDate,
    // nationality,
  });

  try {
    const newAuthor = await author.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
