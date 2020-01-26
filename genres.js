const Joi = require("@hapi/joi");
const express = require("express");
const app = express();

app.use(express.json());

const genres = [
  { _id: 0, name: "Action" },
  { _id: 1, name: "Comedy" },
  { _id: 2, name: "Thriller" },
  { _id: 3, name: "Drama" },
  { _id: 4, name: "Sci-Fi" },
  { _id: 5, name: "Anime" }
];

// * ----------  GET  ----------
app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:_id", (req, res) => {
  const genre = genres.find(e => e._id === parseInt(req.params._id));
  if (!genre) return res.status(404).send("Genre not found");
  res.send(genre);
});

// * ----------  POST  ----------
app.post("/api/genres", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    _id: genres.length,
    name: req.body.name
  };
  genres.push(genre);
  res.send(genre);
});

// * ----------  PUT  ----------
app.put("/api/genres/:_id", (req, res) => {
  // Remember, in JS arrays and Objects are passed by reference. genre = reference to genres.
  const genre = genres.find(e => e._id === parseInt(req.params._id));
  if (!genre) return res.status(404).send("Genre not found");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

// * ----------  DELETE  ----------
app.delete("/api/genres/:_id", (req, res) => {
  const genre = genres.find(e => e._id === parseInt(req.params._id));
  if (!genre) return res.status(404).send("Genre not found");
  genres.splice(genres.indexOf(genre), 1);
  res.send(genre);
});

// * ----------  VALIDATE  ----------
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required()
  });

  return schema.validate(genre);
}

// * SET PORT AND START LISTENING
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
