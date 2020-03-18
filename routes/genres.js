const auth = require("../middleware/auth");
const { Genres, validate } = require("../Models/genre");
const express = require("express");
const router = express.Router();

////////////////////
//! [C]-RUD
////////////////////
//* Expected input format: {"name": "string"}

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let genre = new Genres({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

////////////////////
//! C-[R]-UD
////////////////////

//! *** Returns all genres ***
//* Also sorts genres by name
router.get("/", async (req, res) => {
  try {
    const genres = await Genres.find().sort("name");
    res.send(genres);
  } catch (err) {
    res.status(500).send("Error getting genre list");
  }
});

//! Returns a specific genre
router.get("/:_id", async (req, res) => {
  try {
    const genre = await Genres.findById(req.params._id);
    if (!genre) return res.status(404).send("Genre not found"); //* If the response is null, return a 404, value has already been deleted.
    res.send(genre);
  } catch (err) {
    res.status(404).send("Genre not found");
  }
});

////////////////////
//! CR-[U]-D
////////////////////
//! Updates a specific genre and returns the updated value
router.put("/:_id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genres.findByIdAndUpdate(
      req.params._id,
      { name: req.body.name },
      { new: true }
    );
    if (!genre) return res.status(404).send("Genre not found"); //* If the response is null, return a 404, value has already been deleted.
    res.send(genre);
  } catch (err) {
    res.status(404).send("Genre not found");
  }
});

////////////////////
//! CRU-[D]
////////////////////
router.delete("/:_id", auth, async (req, res) => {
  try {
    const response = await Genres.findByIdAndDelete(req.params._id);
    if (!response) return res.status(404).send("Genre not found"); //* If the response is null, return a 404, value has already been deleted.
    res.send(response);
  } catch (err) {
    res.status(404).send("Genre not found");
  }
});

////////////////////////
//! Exports
////////////////////////
module.exports = router;
