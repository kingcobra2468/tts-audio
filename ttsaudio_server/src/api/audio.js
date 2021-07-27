/* eslint-disable import/no-unresolved */
const express = require('express');
const { getVolume, setVolume } = require('@utils/audio_controls');

const router = express.Router();

router.get('/get-volume', (req, res) => {
  const audioLevel = getVolume(); // get volume level

  res.send({
    level: audioLevel,
    error: (audioLevel === -1),
  });
});

router.put('/set-volume', (req, res) => {
  const audioLevel = parseInt(req.query.level, 10);

  if (req.query.level === undefined) { // level query-arg doesnt exist
    res.send({
      error: true,
      message: 'volume not specifed (query param "level" empty)',
    });
    res.end();

    return;
  } if (Number.isNaN(audioLevel)) { // level query-arg isnt valid type
    res.send({
      error: true,
      message: 'volume incorrect type (query param "level" not number)',
    });
    res.end();

    return;
  }

  const status = setVolume(audioLevel); // set the volume

  res.send({
    level: audioLevel,
    error: (!status),
  });
});

module.exports = router;
