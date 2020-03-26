const winston = require("winston");
require("winston-mongodb");
const logConfiguration = require("../config/winston-config");
const config = require("config");

// Create the logger
const logger = winston.createLogger(logConfiguration);

/* 
// Notify for uncaught promise rejection.
process.on("unhandledRejection", ex => {
  console.log("WE GOT AN UNCOUGHT REJECTION, LOGGING & SHUTTING DOWN");
  logger.error(ex.message, ex);
  process.exit(1);
});
 */

//! Catch any uncaught Exceptions, log them to exception file under logs and output a version to console.
//* Seems to now also deal with unhandled promises too
// I'll also log this to the DB
logger.exceptions.handle(
  new winston.transports.File({
    level: "warn",
    filename: "./logs/exceptions.log"
  }),
  new winston.transports.Console(),
  new winston.transports.MongoDB({
    db: config.get("mongoDBKey"),
    options: {
      useUnifiedTopology: true
    },
    level: "warn",
    capped: true,
    cappedSize: 1000000
  })
);

// Catch-all error response/logger
module.exports = function(err, req, res, next) {
  logger.error(err.message, err);
  res.status(500).send("Something Failed.");
};
