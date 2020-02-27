const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const app = express();

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

//* This connection string is hardcoded, but in a real app it should be located in a cfg file.
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("connected to MongoDB..."))
  .catch(err => console.log("Could not connect to MongoDB...", err.message));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);

// * SET PORT AND START LISTENING
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
