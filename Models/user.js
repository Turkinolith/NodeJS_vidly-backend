const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const passwordComplexity = require("joi-password-complexity");
const config = require("config");
const jwt = require("jsonwebtoken");

// * ----------  PRE VALIDATE CUSTOMER NAME and PHONE NUMBER ----------
function validateUser(user) {
  const complexityOptions = {
    min: 7,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 2,
    requirementCount: 4
  };
  /*
		Min & Max not considered in the count. 
		Only lower, upper, numeric and symbol. 
		requirementCount could be from 1 to 4 
		If requirementCount=0, then it takes count as 4
    */

  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(30)
      .trim()
      .required(),
    email: Joi.string()
      .email()
      .trim()
      .required()
      .max(255),
    password: passwordComplexity(complexityOptions)
  });

  return schema.validate(user);
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    trim: true
  },
  email: {
    type: String,
    required: true,
    maxlength: 255,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  isAdmin: Boolean
});

//* Attach the creation logic for a Token as a method on the user object
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

//* Define customers model (moved the schema declaration into it.)
let Users;
try {
  Users = mongoose.model("User");
} catch (error) {
  Users = mongoose.model("User", userSchema);
}

exports.Users = Users;
exports.validateUser = validateUser;
