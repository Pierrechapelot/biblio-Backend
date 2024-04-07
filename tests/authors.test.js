const request = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');
const Author = require('../models/authors'); 
const Book = require('../models/books'); 


beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
   await mongoose.connection.close();
});

beforeEach(async () => {

  await Author.deleteMany({});
  await Book.deleteMany({});
});

describe("Authors API", () => {
  it("POST /authors should create a new author", async () => {
    const newAuthorData = {
      lastName: "Doe",
      firstName: "John"
    };

    const response = await request(app)
      .post('/authors')
      .send(newAuthorData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.lastName).toBe(newAuthorData.lastName);
  });

  it("GET /authors should return all authors", async () => {
    const response = await request(app).get('/authors');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("GET /authors/:id should return a specific author", async () => {
    const author = new Author({ lastName: "Doe", firstName: "John" });
    await author.save();

    const response = await request(app).get(`/authors/${author._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toEqual(author._id.toString());
  });

  it("PUT /authors/:id should update an author's details", async () => {
    const author = new Author({ lastName: "Doe", firstName: "John" });
    await author.save();

    const updatedData = { lastName: "Smith", firstName: "Jane" };
    const response = await request(app)
      .put(`/authors/${author._id}`)
      .send(updatedData);

    expect(response.statusCode).toBe(200);
    expect(response.body.lastName).toBe(updatedData.lastName);
  });

  it("DELETE /authors/:id should remove the author", async () => {
    const author = new Author({ lastName: "Doe", firstName: "John" });
    await author.save();

    const response = await request(app).delete(`/authors/${author._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain("supprimé");
  });

  it("GET /authors/:id/books should return books of a specific author", async () => {
    const author = new Author({ lastName: "Doe", firstName: "John" });
    await author.save();

    const book = new Book({ title: "Book Title", author: author._id });
    await book.save();

    const response = await request(app).get(`/authors/${author._id}/books`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]._id).toEqual(book._id.toString());
  });
});
