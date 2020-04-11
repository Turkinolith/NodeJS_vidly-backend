const express = require("express");
const router = express.Router();
const { Customers } = require("../Models/customer");
const { Movies } = require("../Models/movie");
const { Rentals } = require("../Models/rental");
const auth = require("../middleware/auth");
const moment = require("moment");

////////////////////
//! [C]-RUD
////////////////////
//* Expected input format: {"customerId": "ObjectId", "movieId": "ObjectId"}

router.post("/", auth, async (req, res) => {
  let customer = null;
  let movie = null;
  try {
    customer = await Customers.findById(req.body.customerId);
  } catch (err) {
    return res.status(400).send("Invalid customer.");
  }

  try {
    movie = await Movies.findById(req.body.movieId);
  } catch (err) {
    return res.status(400).send("Invalid movie.");
  }

  const rental = await Rentals.findOne({
    "renter._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental) return res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

  await rental.save();

  return res.status(200).send();
});

module.exports = router;
