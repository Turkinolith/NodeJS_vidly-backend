const auth = require("../middleware/auth");
const { Movies, validateMovie } = require("../Models/movie");
const { Genres } = require("../Models/genre");
const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");

////////////////////
//! [C]-RUD
////////////////////
//* Expected input format: {"title": "string", "genreId": "string", "numberInStock": "number", "dailyRentalRate": "number"}

router.post("/", [auth, validate(validateMovie)], async (req, res) => {
  const genre = await Genres.findById(req.body.genreId); //* Searches Genres DB with ID# provided by genreId, returns genre object w. name & _id
  if (!genre) return res.status(400).send("Invalid genre.");

  try {
    const movie = new Movies({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
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
    const movieList = await Movies.find().sort("title");
    res.send(movieList);
  } catch (err) {
    res.status(500).send("Error getting movie list");
  }
});

//! Returns a specific movie
router.get("/:_id", async (req, res) => {
  try {
    const movie = await Movies.findById(req.params._id);
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
router.put("/:_id", [auth, validate(validateMovie)], async (req, res) => {
  const genre = await Genres.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  try {
    const movie = await Movies.findByIdAndUpdate(
      req.params._id,
      {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: { _id: genre._id, name: genre.name },
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
router.delete("/:_id", auth, async (req, res) => {
  try {
    const response = await Movies.findByIdAndDelete(req.params._id);
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
