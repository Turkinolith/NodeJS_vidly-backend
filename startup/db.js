const config = require("config");
const mongoose = require("mongoose");
const { remoteLogger } = require("./logging");

module.exports = function() {
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
  mongoose.set("useUnifiedTopology", true);

  //* Establish Mongoose connection:
  mongoose.connect(config.get("mongoDBKey"));

  //* Notify on events if the DB is connected or announce error if could not connect.
  mongoose.connection.once("open", () =>
    remoteLogger.info("connected to Mongo Database")
  );
};
