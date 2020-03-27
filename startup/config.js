const config = require("config");

module.exports = function() {
  //* Verify that secret keys are enabled
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
  if (!config.get("mongoDBKey")) {
    console.log("FATAL ERROR: mongoDBKey is not defined.");
    process.exit(1);
  }
};
