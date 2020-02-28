const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

// * ----------  PRE VALIDATE GENRE NAMES ----------
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .trim()
      .required()
  });

  return schema.validate(genre);
}

//* Define genres model (moved the schema declaration into it.)
const Genres = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
      unique: true
    }
  })
);

exports.Genres = Genres;
exports.validate = validateGenre;
