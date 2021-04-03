const express = require('express');
const multer = require('multer');
const audio = require('@api/audio');
const speak = require('@api/speak');
const auth = require('@utils/authenticate');
const logger_lib = require('@utils/logger');

const PORT = 8081;
const LOG_PATH = ".";

var app = express();
var logger = logger_lib.logger(`${LOG_PATH}/events.log`);

// logger
app.use(function (req, res, next) {

    formatted_str = `${req.ip} - ${req.path} <${JSON.stringify(req.query)}>`;
    logger.log(logger.STATES.info, formatted_str);
    next();
});

// simple protection:
//app.use(auth);

app.use('/audio', audio);
app.use('/speak', speak);

app.use('*', function (req, res) {

    res.status(404);
    res.send('<h1>ERROR 404:</h1>\n<i>Invalid Path: ' + req.path + '</i>');
})

app.listen(PORT);

// FUTURE - USE OR CREATE OWN IMPLEMENTATION of DDOS GUARD using Object / in memory DB
//https://www.npmjs.com/package/ddos