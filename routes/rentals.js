const { Rentals, validateRental } = require("../Models/rental");
const { Movies } = require("../Models/movie");
const { Customers } = require("../Models/customer");
const express = require("express");
const router = express.Router();

////////////////////
//! [C]-RUD
////////////////////
//* Expected Format { "customerId": "string" "movieId": "string" }

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
      phone: customer.phone,
      isGold: customer.isGold
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  ////////////////////////////
  //! Here there is a problem, we have 2 seperate operations going on. If the server crashes after the rental save, the decrement of stock may not occur.
  //! This needs a "transaction" where both actions need to happen, or neither are applied.
  //! There is a technique called "2 phase commit", but that is an advanced topic beyond the scope of this course.
  rental = await rental.save();

  movie.numberInStock--;
  movie.save();
  ////////////////////////////
  res.send(rental);
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
