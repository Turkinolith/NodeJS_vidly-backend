const auth = require("../middleware/auth");
const { Rentals, validateRental } = require("../Models/rental");
const { Movies } = require("../Models/movie");
const { Customers } = require("../Models/customer");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const validate = require("../middleware/validate");

////////////////////
//! [C]-RUD
////////////////////
//* Expected Format { "customerId": "string" "movieId": "string" }

router.post("/", [auth, validate(validateRental)], async (req, res) => {
  let customer = null;
  try {
    customer = await Customers.findById(req.body.customerId);
  } catch (err) {
    return res.status(400).send("Invalid customer.");
  }

  let movie = null;
  try {
    movie = await Movies.findById(req.body.movieId);
  } catch (err) {
    return res.status(400).send("Invalid movie.");
  }

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  try {
    mongoose.startSession().then((session) => {
      session.withTransaction(
        async () => {
          let rental = new Rentals({
            renter: {
              _id: customer._id,
              name: customer.name,
              phone: customer.phone,
              isGold: customer.isGold,
            },
            movie: {
              _id: movie._id,
              title: movie.title,
              dailyRentalRate: movie.dailyRentalRate,
            },
          });

          await rental.save();
          movie.numberInStock--;
          await movie.save();
          res.send(rental);
        },
        { writeConcern: { wtimeout: 5000 } }
      );
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

////////////////////
//! C-[R]-UD
////////////////////
//! Returns all Rental tickets
router.get("/", async (req, res) => {
  const rentallist = await Rentals.find();
  res.send(rentallist);
});

//! Returns a specific Rental
router.get("/:_id", async (req, res) => {
  try {
    const rental = await Rentals.findById(req.params._id);
    if (!rental) return res.status(404).send("Rental ticket not found");
    res.send(rental);
  } catch (err) {
    res.status(404).send("Rental ticket not found");
  }
});

////////////////////////
//! Exports
////////////////////////
module.exports = router;
