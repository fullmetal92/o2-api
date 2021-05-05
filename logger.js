/**
 * Winston logger wrapper
 */

const fs = require('fs');
const path = require('path');
const winston = require('winston');
const moment = require('moment');
const config = require('dotenv').config();
const env = process.env.NODE_ENV || 'development';

const logDirName = process.env.LOG_DIR;
const logDir = path.join(__dirname, logDirName);
const logPath = path.join(logDir, env);

// Create the log directory if it does not exist
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(path.join(__dirname, logDirName));
    fs.mkdirSync(logPath);
}

const logger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info',
            prettyPrint: true
        }),
        new (winston.transports.File)({
            filename: path.join(logPath, moment().format(process.env.LOG_DATE_FORMAT) + process.env.LOG_EXTENSION),
            timestamp: tsFormat,
            level: env === 'development' ? 'debug' : 'info',
        })
    ]
});

/**
 * Specify timestamp for the log entries
 * @returns {string}
 */
function tsFormat() {
    return (new Date()).toLocaleTimeString();
}

module.exports = logger;
