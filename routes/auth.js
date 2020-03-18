const { Users } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const passwordComplexity = require("joi-password-complexity");

// * ----------  PRE VALIDATE Email and Password ----------
function validate(req) {
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
    email: Joi.string()
      .email()
      .trim()
      .required()
      .max(255),
    password: passwordComplexity(complexityOptions)
  });

  return schema.validate(req);
}

router.post("/", async (req, res) => {
  //* Use Joi to pre-validate the request body.
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //* Validate that the email is in the DB already.
  //! Note, this returns a 400 error, not a 404, I don't want to tell the client "WHY" it failed, just that the provided data is invalid

  let user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  try {
    const passIsValid = await bcrypt.compare(req.body.password, user.password);
    if (!passIsValid) return res.status(400).send("Invalid email or password.");

    //* Create JWT token for authenticated user
    const token = user.generateAuthToken();

    res.send(token);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

////////////////////////
//! Exports
////////////////////////
module.exports = router;
