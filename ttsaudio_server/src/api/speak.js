/* eslint-disable import/no-unresolved */
const express = require('express');
const multer = require('multer');
const say = require('say');
const fs = require('fs');
const { playWAV } = require('@utils/audio_controls');

const router = express.Router();
const upload = multer({ dest: '/tmp' }).single('audio');

router.post('/say', (req, res) => {
  const { text } = req.query;

  if (text === undefined) { // text query-arg doesnt exist
    res.status(400);

    res.send({
      error: true,
      message: 'text not specifed (query param "text" empty)',
    });
    res.end();

    return;
  }

  say.speak(text); // playback of text via festival

  res.send({
    error: false,
    message: text,
  });
});

router.post('/play', (req, res) => {
  let error = false;
  let errorMsg = '';

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) { // error uploading file
      res.status(412);
      res.send({
        error: true,
        message: 'error uploading file',
      });
      res.end();

      return;
    }

    const playErr = playWAV(req.file.path); // play the wav file
    fs.unlink(req.file.path, (_) => { }); // delete file from local system

    if (playErr) { // error occured while playing wave
      res.status(500);
      error = true;

      if (playErr === 1) {
        errorMsg = 'No such file or directory';
      } else { // error using aplay utility
        errorMsg = 'Error with aplay';
      }
    }

    res.send({
      error,
      message: errorMsg,
    });
  });
});

module.exports = router;
