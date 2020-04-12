require("./startup/config")();
const { logger } = require("./startup/logging");
const express = require("express");
const app = express();
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/prod")(app);

// * SET PORT AND START LISTENING
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  logger.info(`listening on port ${port}...`)
);
module.exports = server;
