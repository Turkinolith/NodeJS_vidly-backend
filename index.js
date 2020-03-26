require("express-async-errors");

const error = require("./middleware/error");
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi); //The require returns a function, so pass Joi const into it, it then again returns a function so we set Joi.objectId equall to it.
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const customers = require("./routes/customers");
const auth = require("./routes/auth");
const app = express();

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

//* Verify that secret keys are enabled
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}
if (!config.get("mongoDBKey")) {
  console.log("FATAL ERROR: mongoDBKey is not defined.");
  process.exit(1);
}

//* Establish Mongoose connection:

mongoose
  //* Local DB
  //.connect("mongodb://localhost/vidly")
  //* Atlas Cluster DB on AWS using CFG key
  .connect(config.get("mongoDBKey"));

//* Notify on events if the DB is connected or announce error if could not connect.
mongoose.connection
  .once("open", () => console.log("connected to Mongo database"))
  .on("error", error => {
    console.log("Error: ", error.message);
  });

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/customers", customers);
app.use("/api/auth", auth);

//* Error Handling, always comes after other routes.
//* Used for error 500's
app.use(error);

// * SET PORT AND START LISTENING
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
