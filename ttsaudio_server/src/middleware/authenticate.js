/* eslint-disable import/no-unresolved */
const express = require('express');
const { getCredentials } = require('@utils/auth_utils');
const { USERNAME, PASSWORD } = require('@/config');

const router = express.Router();

router.use((req, res, next) => {
  let creds;
  let credsError = false;

  try { // attempt to parse base64 auth string
    creds = getCredentials(req.headers.authorization);
  } catch (error) {
    credsError = true;
  }

  if (creds === undefined || credsError) { // creds failed or werent able to get fetched
    res.status(403);
    res.send({
      text: 'credentials missing',
      error: true,
    });
    res.end();
  } else if (creds.username !== USERNAME || creds.password !== PASSWORD) { // creds not correct
    res.status(401);
    res.send({
      text: 'credentials missing/incorrect',
      error: true,
    });
    res.end();
  } else { // creds were successful, continue onto request/next middleware
    next();
  }
});

module.exports = router;
