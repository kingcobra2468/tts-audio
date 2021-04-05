const express = require('express');
const audio = require('@api/audio');
const speak = require('@api/speak');
const auth = require('@middleware/authenticate');
const { LEVELS, append_log_record } = require('@utils/logger');
const { LOG_FILE, PORT, HOST, AUTH_ENABLED } = require('@/config')

var app = express();

// request logger
app.use(function (req, res, next) {

    formatted_str = `${req.ip} - ${req.path} <${JSON.stringify(req.query)}>`;
    append_log_record(LEVELS.INFO, formatted_str);
    next();
});

// simple auth protection
if (AUTH_ENABLED)
    app.use(auth);

// add routes
app.use('/api/audio', audio);
app.use('/api/speak', speak);

app.use('*', function (req, res) {

    res.status(404);
    res.send({
        'error': true,
        'message': 'invalid path'
    });
})

app.listen(PORT, HOST, () => {
    console.log(`Started listening on ${HOST}:${PORT}`)
});