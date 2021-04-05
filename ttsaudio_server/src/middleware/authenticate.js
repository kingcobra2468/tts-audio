const express = require('express');
const { get_credentials } = require('@utils/auth_utils');
const { USERNAME, PASSWORD } = require('@/config')

var router = express.Router();

router.use(function (req, res, next) {

    var creds;
    var creds_error = false;

    try { // attempt to parse base64 auth string
        creds = get_credentials(req.headers.authorization);
    }
    catch (error) {
        creds_error = true;
    };

    if (creds === undefined || creds_error) { // creds failed or werent able to get fetched

        res.status(403);
        res.send({
            'text': 'credentials missing',
            'error': true,
        });
        res.end();

        return;
    }
    else if (creds.username !== USERNAME || creds.password !== PASSWORD) { // creds not correct

        res.status(401);
        res.send({
            'text': 'credentials missing/incorrect',
            'error': true,
        });
        res.end();

        return;
    }
    else { // creds were successful, continue onto request/next middleware
        next();
    }
})

module.exports = router;