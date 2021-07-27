/* eslint-disable import/no-unresolved */
const express = require('express');
const audio = require('@api/audio');
const speak = require('@api/speak');
const auth = require('@middleware/authenticate');
const { LEVELS, appendLogRecord } = require('@utils/logger');
const {
  PORT, HOST, AUTH_ENABLED,
} = require('@/config');

const app = express();

// request logger
app.use((req, res, next) => {
  const reqLog = `${req.ip} - ${req.path} <${JSON.stringify(req.query)}>`;
  appendLogRecord(LEVELS.INFO, reqLog);
  next();
});

// simple auth protection
if (AUTH_ENABLED) app.use(auth);

// add routes
app.use('/api/audio', audio);
app.use('/api/speak', speak);

app.use('*', (req, res) => {
  res.status(404);
  res.send({
    error: true,
    message: 'invalid path',
  });
});

app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Started listening on ${HOST}:${PORT}`);
});
