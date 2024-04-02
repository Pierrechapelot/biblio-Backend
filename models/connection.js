const mongoose = require("mongoose");

const connectionString = "mongodb+srv://admin:c7%40G!fRaYRj!8ni@cluster0.goz23rh.mongodb.net/";

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))

  .catch((error) => console.error(error));
