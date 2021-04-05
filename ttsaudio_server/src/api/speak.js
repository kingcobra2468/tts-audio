const express = require('express');
const multer = require('multer');
const say = require('say');
const fs = require('fs')
const { play_wav } = require('@utils/audio_controls');

var router = express.Router();
const upload = multer({ 'dest': '/tmp' }).single('audio');

router.get('/say', function (req, res) {

    var text = req.query.text;

    if (text == undefined) { // text query-arg doesnt exist

        res.status(400);

        res.send({
            'error': true,
            'message': 'text not specifed (query param "text" empty)'
        });
        res.end();

        return
    }

    say.speak(text); // playback of text via festival

    res.send({
        'error': false,
        'message': text
    });
});

router.post('/play', function (req, res) {

    let error = false;
    let error_msg = '';

    upload(req, res, function (err) {

        if (err instanceof multer.MulterError) { // error uploading file

            res.status(412);
            res.send({
                'error': true,
                'message': 'error uploading file'
            });
            res.end();

            return;
        }

        let play_err = play_wav(req.file.path); // play the wav file
        fs.unlink(req.file.path, (err) => { }); // delete file from local system

        if (play_err) { // error occured while playing wave

            res.status(500);
            error = true;

            if (play_err == 1) // directory not found
                error_msg = 'No such file or directory';
            else // error using aplay utility
                error_msg = 'Error with aplay'
        }

        res.send({
            'error': error,
            'message': error_msg
        });
    })
});

module.exports = router;