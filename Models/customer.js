const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const CustomJoi = Joi.extend(require("joi-phone-number"));

// * ----------  PRE VALIDATE CUSTOMER NAME and PHONE NUMBER ----------
function validateCustomer(customer) {
  const schema = CustomJoi.object({
    name: CustomJoi.string().min(2).max(30).trim().required(),
    phone: CustomJoi.string()
      .phoneNumber({ defaultCountry: "US", strict: true })
      .trim()
      .required(),
    isGold: CustomJoi.boolean(),
  });

  return schema.validate(customer);
}

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
});

//* Define customers model (moved the schema declaration into it.)
let Customers;
try {
  Customers = mongoose.model("Customer");
} catch (error) {
  Customers = mongoose.model("Customer", customerSchema);
}

//const Customers = mongoose.model("Customer", customerSchema);

exports.Customers = Customers;
exports.validateCustomer = validateCustomer;
