const express = require('express');
const audio = require('./audio');
const speak = require("./speak");
const auth = require('./authenticate');
const logger_lib = require('./logger');

const PORT = 8081;
var app = express();
var logger = logger_lib.logger('events.log');

// logger
app.use(function(req, res, next){
   
    formatted_str = `${req.ip} - ${req.path} <${JSON.stringify(req.query)}>`;
    logger.log(logger.STATES.info, formatted_str);
    next();
});

// simple protection:
app.use(auth);

app.use("/audio", audio);
app.use("/speak", speak);

app.use('*', function(req, res) {

    res.status(404);
    res.send("<h1>ERROR 404:</h1>\n<i>Invalid Path: " + req.path + "</i>");
})


app.listen(PORT);

// FUTURE - USE OR CREATE OWN IMPLEMENTATION of DDOS GUARD using Object / in memory DB
//https://www.npmjs.com/package/ddos
