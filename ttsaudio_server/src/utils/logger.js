const fs = require('fs');
const { LOG_FILE } = require('@/config')

const LEVELS = { // log level mappings
    INFO: 'INFO', DEBUG: 'DEBUG', WARNING: 'WARNING',
    ERROR: 'ERROR', FATAL: 'FATAL'
};
const LEVELS_KEYS = Object.keys(LEVELS); // accepted log levels

/**
 * Formats a log record into a string
 * @param {string} level 
 * @param {string} log_msg 
 * @returns 
 */
const format_log_record = function (level, log_msg) {

    var date = Date(); // gets the current time
    var formatted_log = `${level} [${date}] ${log_msg}\n`;

    return formatted_log;
};

/**
 * Adds a new record into the logs file
 * @param {string} level 
 * @param {*string record 
 */
var append_log_record = function (level, record) {

    if (!LEVELS_KEYS.includes(level.toUpperCase())) throw new Error( // check if log level is valid
        `State ${level} not an option of ${LEVELS_KEYS.toString()}`);

    fs.appendFile(LOG_FILE, format_log_record(level, record), function (error) { // appends to file

        if (error) throw new Error(error.message); // unable to append to log file
    });
};

module.exports = { LEVELS, append_log_record }