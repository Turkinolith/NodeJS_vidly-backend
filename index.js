const express = require("express");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi); //The require returns a function, so pass Joi const into it, it then again returns a function so we set Joi.objectId equall to it.
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const customers = require("./routes/customers");
const app = express();

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

//* This connection string is hardcoded, but in a real app it should be located in a cfg file.
mongoose
  //* Local DB
  //.connect("mongodb://localhost/vidly")
  //* Atlas Cluster DB on AWS
  //! REMOVE LOGIN LINE BEFORE PUSHING TO GIT OR OTHER SERVICE.
  .connect(
    "mongodb+srv://vidlyuser:5UfO6cjKJRmfv675@tester-00-dbmjh.mongodb.net/vidly?retyWrites=true&w=majority"
  );
//.then(() => console.log("connected to MongoDB..."))
//.catch(err => console.log("Could not connect to MongoDB...", err.message));

//* This replaces the .then and .catch from the connect above using event listeners.
mongoose.connection
  .once("open", () => console.log("connected to Mongo database"))
  .on("error", error => {
    console.log("Error: ", error.message);
  });

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/customers", customers);

// * SET PORT AND START LISTENING
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
