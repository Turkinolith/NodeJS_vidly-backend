require("winston-mongodb");
const { logger } = require("../startup/logging");

// Catch-all error response/logger
module.exports = function(err, req, res, next) {
  logger.error(err.message, err);
  res.status(500).send("Something Failed.");
};
