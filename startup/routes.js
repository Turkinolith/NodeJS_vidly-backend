const express = require("express");
const error = require("../middleware/error");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const customers = require("../routes/customers");
const auth = require("../routes/auth");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/customers", customers);
  app.use("/api/auth", auth);

  //* Error Handling, always comes after other routes.
  //* Used for error 500's
  app.use(error);
};
