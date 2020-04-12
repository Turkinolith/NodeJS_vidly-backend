const auth = require("../middleware/auth");
const { Users, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const validate = require("../middleware/validate");

////////////////////
//! REGISTER USER
////////////////////
//* Expected input format: {"name": "string", "email": "string", "password": "string"}

router.post("/", validate(validateUser), async (req, res) => {
  // Make sure the email address is not already used.
  let user = await Users.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  try {
    // Using lodash to ensure that only the name email and password fields are processed.
    user = new Users(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(11);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    // Using lodash again to return the saved user object, minus the password.
    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

////////////////////
//! C-[R]-UD
////////////////////

router.get("/me", auth, async (req, res) => {
  const user = await Users.findById(req.user._id).select("-password");
  res.send(user);
});

////////////////////////
//! Exports
////////////////////////
module.exports = router;
