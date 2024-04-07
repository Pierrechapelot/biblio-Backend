require('dotenv').config(); 
const app = require('../app'); // Assurez-vous que ceci pointe vers le fichier où votre app Express est définie
const mongoose = require('mongoose');
const Book = require('../models/books'); // Assurez-vous que le chemin est correct


beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
});

// Nettoyer la collection de livres avant chaque test
beforeEach(async () => {
  await Book.deleteMany({});
});

describe('POST /books', () => {
  it('should create a new book', async () => {
    const newBook = {
      title: 'Test Book',
      genre: 'Test Genre',
      isbn: '123456789',
      publicationDate: '2023-01-01',
      description: 'Test Description',
      available: true,
      firstName: 'John',
      lastName: 'Doe'
    };

    const response = await request(app)
      .post('/books')
      .send(newBook);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe(newBook.title);
  });
});

describe('GET /books', () => {
  it('should retrieve all books', async () => {
    // Insérez ici un livre pour le test
    await new Book({
      title: 'Test Book',
      genre: 'Test Genre',
      isbn: '123456789',
      publicationDate: '2023-01-01',
      description: 'Test Description',
      available: true,
      // Vous devez ajouter un auteur existant ou mocker cette partie
    }).save();

    const response = await request(app).get('/books');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });


  describe('GET /books/search', () => {
    it('should return books that match the title search', async () => {
      // Assurez-vous d'avoir un livre qui correspond aux critères de recherche dans votre base de données de test
      const bookTitle = 'Unique Book Title';
      await new Book({
        title: bookTitle,
        // Ajoutez les autres propriétés nécessaires
      }).save();
  
      const response = await request(app).get(`/books/search?title=${bookTitle}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].title).toBe(bookTitle);
    });
  
    it('should return books that match the genre search', async () => {
      // Similaire à ci-dessus, mais pour le genre
    });
  });
  

  describe('PUT /books/:id', () => {
    it('should update a book and return the updated book', async () => {
      // Créez d'abord un livre pour le test
      const book = await new Book({
        title: 'Initial Title',
        // Ajoutez les autres propriétés nécessaires
      }).save();
  
      const updatedTitle = 'Updated Title';
      const response = await request(app)
        .put(`/books/${book._id}`)
        .send({ title: updatedTitle }); // Envoyez les données que vous souhaitez mettre à jour
  
      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe(updatedTitle);
    });
  });
  

  describe('DELETE /books/:id', () => {
    it('should delete a book and confirm deletion', async () => {
      // Créez d'abord un livre pour le test
      const book = await new Book({
        title: 'Book to be deleted',
        // Ajoutez les autres propriétés nécessaires
      }).save();
  
      const deleteResponse = await request(app).delete(`/books/${book._id}`);
      expect(deleteResponse.statusCode).toBe(200);
      expect(deleteResponse.body.message).toBe('Book deleted successfully');
  
      // Vérifiez ensuite que le livre n'existe plus
      const fetchResponse = await request(app).get(`/books/${book._id}`);
      expect(fetchResponse.statusCode).toBe(404);
    });
  });
  
});



// Ajoutez ici plus de tests pour les autres endpoints
