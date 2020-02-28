const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const CustomJoi = Joi.extend(require("joi-phone-number"));

//* Define customers model (moved the schema declaration into it.)
const Customers = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    isGold: {
      type: Boolean,
      default: false
    }
  })
);

// * ----------  PRE VALIDATE CUSTOMER NAME and PHONE NUMBER ----------
function validateCustomer(customer) {
  const schema = CustomJoi.object({
    name: CustomJoi.string()
      .min(2)
      .max(30)
      .trim()
      .required(),
    phone: CustomJoi.string()
      .phoneNumber({ defaultCountry: "US", strict: true })
      .trim()
      .required(),
    isGold: CustomJoi.boolean()
  });

  return schema.validate(customer);
}

exports.Customers = Customers;
exports.validate = validateCustomer;
