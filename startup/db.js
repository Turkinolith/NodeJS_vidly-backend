const config = require("config");
const mongoose = require("mongoose");
const { remoteLogger } = require("./logging");

module.exports = function() {
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
  mongoose.set("useUnifiedTopology", true);

  const db = config.get("mongoDBKey");
  const [dbString] = db.match(/(tester.+)(.*)(\?)/gs); // extract DB connection name without returning all info.

  //* Establish Mongoose connection:
  mongoose.connect(db);

  //* Notify on events if the DB is connected or announce error if could not connect.
  mongoose.connection.once("open", () =>
    remoteLogger.info(`connected to ${dbString} ...`)
  );
};
