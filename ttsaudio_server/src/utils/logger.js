/* eslint-disable import/no-unresolved */
const fs = require('fs');
const { LOG_FILE } = require('@/config');

const LEVELS = { // log level mappings
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  FATAL: 'FATAL',
};
const LEVELS_KEYS = Object.keys(LEVELS); // accepted log levels

/**
 * Formats a log record into a string
 * @param {string} level
 * @param {string} logMsg
 * @returns
 */
const formatLogRecord = (level, logMsg) => {
  const date = Date(); // gets the current time
  const log = `${level} [${date}] ${logMsg}\n`;

  return log;
};

/**
 * Adds a new record into the logs file
 * @param {string} level
 * @param {*string record
 */
const appendLogRecord = (level, record) => {
  if (!LEVELS_KEYS.includes(level.toUpperCase())) {
    throw new Error( // check if log level is valid
      `State ${level} not an option of ${LEVELS_KEYS.toString()}`,
    );
  }

  fs.appendFile(LOG_FILE, formatLogRecord(level, record), (error) => {
    if (error) throw new Error(error.message); // unable to append to log file
  });
};

module.exports = { LEVELS, appendLogRecord };
