require("./startup/config")();
const { logger } = require("./startup/logging");
const express = require("express");
const app = express();
require("./startup/logging");
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/db")();

// * SET PORT AND START LISTENING
const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`listening on port ${port}...`));
