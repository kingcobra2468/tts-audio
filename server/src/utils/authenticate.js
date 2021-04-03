const express = require('express');

const USERNAME = 'Username';
const PASSWORD = 'Password';

var router = express.Router();

var get_credentials = function (base64_str) {

    let base64_regex_pattern = RegExp('^BASIC ([A-Z]|[a-z]|[0-9]|[+/=]){1,}$');

    if (!base64_regex_pattern.test(base64_str)) {
        throw new Error('BASE64 encoded input is incorrectly formatted.');
    }

    let base64_credentials = base64_str.split(' ')[1]
    let decoded_base64_credentials = new Buffer(base64_credentials, 'base64').toString();
    let [username, password] = ['', ''];

    if (decoded_base64_credentials != ':') {
        [username, password] = new Buffer(base64_credentials, 'base64').toString().split(':');
    }
    else {
    }

    return {
        'username': username,
        'password': password
    }
};

router.use(function (req, res, next) {

    var creds;
    var creds_error = false;

    try {
        creds = get_credentials(req.headers.authorization);
    }
    catch (error) {
        creds_error = true;
    };

    if (creds === undefined || creds_error) {

        res.status(403);
        res.send('<h1>Credentials Missing ;P</h1>');
        res.end();
        return;
    }
    else if (creds.username !== USERNAME || creds.password !== PASSWORD) {

        res.status(401);
        res.send('<h1>Credentials Missing/Incorrect ;P</h1>');
        res.end();
        return;
    }
    else {
        next();
    }
})

module.exports = router;