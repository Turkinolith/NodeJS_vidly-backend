const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const { Genres, validateGenre } = require("../Models/genre");
const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");

////////////////////
//! [C]-RUD
////////////////////
//* Expected input format: {"name": "string"}

router.post("/", [auth, validate(validateGenre)], async (req, res, next) => {
  try {
    let genre = new Genres({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
  } catch (ex) {
    next(ex);
  }
});

////////////////////
//! C-[R]-UD
////////////////////

//! *** Returns all genres ***
//* Also sorts genres by name
router.get("/", async (req, res) => {
  const genres = await Genres.find().sort("name");
  res.send(genres);
});

//! Returns a specific genre
router.get("/:_id", validateObjectId, async (req, res) => {
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
router.put(
  "/:_id",
  [auth, validateObjectId, validate(validateGenre)],
  async (req, res) => {
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
  }
);

////////////////////
//! CRU-[D]
////////////////////
router.delete("/:_id", [auth, admin, validateObjectId], async (req, res) => {
  try {
    const response = await Genres.findByIdAndDelete(req.params._id);
    if (!response)
      return res.status(404).send("Genre with given ID was not found"); //* If the response is null, return a 404, value has already been deleted.
    res.send(response);
  } catch (err) {
    res.status(400).send("Server Error");
  }
});

////////////////////////
//! Exports
////////////////////////
module.exports = router;
