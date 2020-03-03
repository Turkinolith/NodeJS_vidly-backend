const { Rentals, validateRental } = require("../Models/rental");
const { Movies } = require("../Models/movie");
const { Customers } = require("../Models/customer");
const express = require("express");
const router = express.Router();

////////////////////
//! [C]-RUD
////////////////////

router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customers.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movies.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rentals({
    renter: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  rental = await rental.save();

  movie.numberInStock--;
  movie.save();

  res.send(rental);
});

////////////////////
//! C-[R]-UD
////////////////////
router.get("/", async (req, res) => {
  const rentallist = await Rentals.find();
  res.send(rentallist);
});

////////////////////////
//! Exports
////////////////////////
module.exports = router;
