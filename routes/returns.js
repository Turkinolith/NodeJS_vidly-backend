const express = require("express");
const router = express.Router();
const { Movies } = require("../Models/movie");
const { Rentals } = require("../Models/rental");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const validate = require("../middleware/validate");

////////////////////
//! [C]-RUD
////////////////////
//* Expected input format: {"customerId": "ObjectId", "movieId": "ObjectId"}

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rentals.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  //* All DB related edits are done in a single transaction so that in case of an error, the whole
  //* edit can be undone and the DB isn't left in a broken state.
  try {
    mongoose.startSession().then((session) => {
      session.withTransaction(
        async () => {
          rental.return();

          await rental.save();

          await Movies.updateOne(
            { _id: rental.movie._id },
            {
              $inc: { numberInStock: 1 },
            }
          );
          //* Don't have to explicitly set status to 200, as express will set that by default
          res.send(rental);
        },
        { writeConcern: { wtimeout: 5000 } }
      );
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// * ----------  PRE VALIDATE Return ----------
function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

module.exports = router;
