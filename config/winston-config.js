const config = require("config");
const winston = require("winston");
/**
 * Requiring `winston-mongodb` will expose
 * `winston.transports.MongoDB`
 */
require("winston-mongodb");

//* Logger configuration
//* 0- error
//* 1- warn
//* 2- info
//* 3- verbose
//* 4- debug
//* 5- silly
//* level shows the level for the error to be sent to that pipeline
//*  IE: warn and above goes to log, errors also go to console
const logConfiguration = {
  transports: [
    new winston.transports.File({
      level: "warn",
      filename: "./logs/logfile.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    new winston.transports.Console({
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
          return `${info.timestamp} - [${info.level}]: ${info.message}`;
        })
      )
    }),
    new winston.transports.MongoDB({
      db: config.get("mongoDBKey"),
      options: {
        useUnifiedTopology: true
      },
      level: "warn",
      capped: true,
      cappedSize: 1000000
    })
  ]
};

module.exports = logConfiguration;
