const config = require("config");
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
// Requiring `winston-mongodb` will expose winston.transports.MongoDB`

//* Logger configuration
//* 0- error
//* 1- warn
//* 2- info
//* 3- verbose
//* 4- debug
//* 5- silly
//* level shows the level for the error to be sent to that pipeline
//*  IE: warn and above goes to log, errors also go to console

const remoteLogConfig = {
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
      level: "info",
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
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
          return `${info.timestamp} - [${info.level}]: ${info.message}`;
        })
      )
    })
  ]
};

// Create the logger
const logger = winston.createLogger(logConfiguration);

// Create remoteLogger
const remoteLogger = winston.createLogger(remoteLogConfig);

//! Catch any uncaught Exceptions, log them to exception file under logs and output a version to console.
//* Seems to now also deal with unhandled promises too
// I'll also log this to the DB

logger.exceptions.handle(
  new winston.transports.File({
    level: "warn",
    filename: "./logs/exceptions.log"
  }),
  new winston.transports.Console()
);

exports.logConfiguration = logConfiguration;
exports.logger = logger;
exports.remoteLogger = remoteLogger;
