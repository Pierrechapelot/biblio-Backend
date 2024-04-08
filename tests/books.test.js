require('dotenv').config(); 
const app = require('../app');
const mongoose = require('mongoose');
const Book = require('../models/books'); 


beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
});


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

    await new Book({
      title: 'Test Book',
      genre: 'Test Genre',
      isbn: '123456789',
      publicationDate: '2023-01-01',
      description: 'Test Description',
      available: true,

    }).save();

    const response = await request(app).get('/books');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });


  describe('GET /books/search', () => {
    it('should return books that match the title search', async () => {

      const bookTitle = 'Unique Book Title';
      await new Book({
        title: bookTitle,

      }).save();
  
      const response = await request(app).get(`/books/search?title=${bookTitle}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].title).toBe(bookTitle);
    });
  
    it('should return books that match the genre search', async () => {
      const bookGenre = 'Unique Book Genre';
      await new Book({
        title: bookTitle,

      }).save();
  
      const response = await request(app).get(`/books/search?genre=${bookGenre}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].genre).toBe(bookGenre);
    });
  });
  

  describe('PUT /books/:id', () => {
    it('should update a book and return the updated book', async () => {

      const book = await new Book({
        title: 'Initial Title',

      }).save();
  
      const updatedTitle = 'Updated Title';
      const response = await request(app)
        .put(`/books/${book._id}`)
        .send({ title: updatedTitle }); 
  
      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe(updatedTitle);
    });
  });
  

  describe('DELETE /books/:id', () => {
    it('should delete a book and confirm deletion', async () => {

      const book = await new Book({
        title: 'Book to be deleted',

      }).save();
  
      const deleteResponse = await request(app).delete(`/books/${book._id}`);
      expect(deleteResponse.statusCode).toBe(200);
      expect(deleteResponse.body.message).toBe('Book deleted successfully');
  

      const fetchResponse = await request(app).get(`/books/${book._id}`);
      expect(fetchResponse.statusCode).toBe(404);
    });
  });
  
});




