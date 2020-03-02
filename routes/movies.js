const { Movie, validateMovie } = require("../Models/movie");
const { Genres } = require("../Models/genre");
const express = require("express");
const router = express.Router();

////////////////////
//! [C]-RUD
////////////////////
//* Expected input format: {"title": "string", "genreId": "string", "numberInStock": "number", "dailyRentalRate": "number"}

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genres.findById(req.body.genreId); //* Searches Genres DB with ID# provided by genreId, returns genre object w. name & _id
  if (!genre) return res.status(400).send("Invalid genre.");

  try {
    const movie = new Movie({
      title: req.body.title,
      genre: {
        //* Why not set the genre here to the genre object on line 15?
        //* Because it has/could-have more properties that I don't want to put into the movie DB. I don't want to store all of those properties here.
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();

    res.send(movie);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

////////////////////
//! C-[R]-UD
////////////////////

//! *** Returns all movies ***
//* Also sorts movies by title
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort("title");
    res.send(movies);
  } catch (err) {
    res.status(500).send("Error getting movie list");
  }
});

//! Returns a specific movie
router.get("/:_id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params._id);
    if (!movie) return res.status(404).send("Movie not found"); //* If the response is null, return a 404, value has already been deleted.
    res.send(movie);
  } catch (err) {
    res.status(404).send("Movie not found");
  }
});

////////////////////
//! CR-[U]-D
////////////////////
//! Updates a specific genre and returns the updated value
router.put("/:_id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genres.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params._id,
      {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: { _id: genre._id, name: genre.name }
      },
      { new: true }
    );
    if (!movie) return res.status(404).send("Movie not found"); //* If the response is null, return a 404, value has already been deleted.
    res.send(movie);
  } catch (err) {
    res.status(404).send("Movie not found");
  }
});

////////////////////
//! CRU-[D]
////////////////////
router.delete("/:_id", async (req, res) => {
  try {
    const response = await Movie.findByIdAndDelete(req.params._id);
    if (!response) return res.status(404).send("Movie not found"); //* If the response is null, return a 404, value has already been deleted.
    res.send(response);
  } catch (err) {
    res.status(404).send("Movie not found");
  }
});

////////////////////////
//! Exports
////////////////////////
module.exports = router;
