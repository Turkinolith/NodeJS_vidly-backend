const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

// * ----------  PRE VALIDATE MOVIE ----------
function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string()
      .min(2)
      .max(90)
      .trim()
      .required(),
    numberInStock: Joi.number()
      .integer()
      .min(0)
      .required(),
    dailyRentalRate: Joi.number()
      .integer()
      .min(0)
      .max(Joi.ref("numberInStock"))
      .required(),
    genreId: Joi.string() //! Note genreId, not genre, because you want the client to ONLY send the genreId
      .required()
  });

  return schema.validate(movie);
}

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 90,
    trim: true,
    unique: true
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 255,
    required: true
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    required: true
  },
  genre: {
    type: genreSchema,
    required: true
  }
});

//* Define movies model (moved the schema declaration into it.)
const Movies = mongoose.model("Movie", movieSchema);

exports.Movies = Movies;
exports.validateMovie = validateMovie;
exports.movieSchema = movieSchema;
