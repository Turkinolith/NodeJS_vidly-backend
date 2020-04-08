const Joi = require("@hapi/joi");

//* The require returns a function, so pass Joi const into it, it then again returns a function so we set Joi.objectId equall to it.
module.exports = function () {
  Joi.objectId = require("joi-objectid")(Joi);
};
