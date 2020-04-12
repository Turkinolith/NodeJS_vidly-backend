const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

const rentalSchema = new mongoose.Schema({
  renter: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

//* Adding a static method to the rentalSchema class
//* statics returns an object and there I can define the static methods for the rentalSchema class.
//* lookup returns a promise, so the caller will need to await it.
rentalSchema.statics.lookup = function (renterId, movieId) {
  return this.findOne({
    "renter._id": renterId,
    "movie._id": movieId,
  });
};

//* Define Rentals model
const Rentals = mongoose.model("Rental", rentalSchema);

exports.Rentals = Rentals;
exports.validateRental = validateRental;
