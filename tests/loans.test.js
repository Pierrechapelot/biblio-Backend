const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Loan = require('../models/loans'); 
const Book = require('../models/books'); 


beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {

  await mongoose.connection.close();
});

beforeEach(async () => {

  await Loan.deleteMany({});
  await Book.deleteMany({});
});

describe("Loans API", () => {
  it("POST /loans should create a new loan", async () => {
    const newLoanData = {
      book: 'ID_DU_LIVRE',
      userIdentifier: 'IDENTIFIANT_UTILISATEUR',
      loanDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      status: "loaned",
    };

    const response = await request(app)
      .post('/loans')
      .send(newLoanData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.status).toBe(newLoanData.status);
  });

  it("GET /loans should return all loans", async () => {
    const response = await request(app).get('/loans');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("GET /loans/:id should return a specific loan", async () => {
    const loan = new Loan({
      book: 'ID_DU_LIVRE',
      userIdentifier: 'IDENTIFIANT_UTILISATEUR',
      loanDate: new Date(),
      dueDate: new Date(),
      status: "loaned",
    });
    await loan.save();

    const response = await request(app).get(`/loans/${loan._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toEqual(loan._id.toString());
  });

  it("PUT /loans/:id should update a loan's details", async () => {
    const loan = new Loan({
      book: 'ID_DU_LIVRE',
      userIdentifier: 'IDENTIFIANT_UTILISATEUR',
      loanDate: new Date(),
      dueDate: new Date(),
      status: "loaned",
    });
    await loan.save();

    const updatedData = { status: "returned" };
    const response = await request(app)
      .put(`/loans/${loan._id}`)
      .send(updatedData);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(updatedData.status);
  });

  it("DELETE /loans/:id should remove the loan", async () => {
    const loan = new Loan({
      book: 'ID_DU_LIVRE',
      userIdentifier: 'IDENTIFIANT_UTILISATEUR',
      loanDate: new Date(),
      dueDate: new Date(),
      status: "loaned",
    });
    await loan.save();

    const response = await request(app).delete(`/loans/${loan._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain("supprimé");
  });


});
