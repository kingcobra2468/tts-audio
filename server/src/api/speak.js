const express = require('express');
const multer = require('multer');
const say = require('say');
const audio_utils = require('@utils/audio_utils');
const fs = require('fs')

var router = express.Router();
const upload = multer({ 'dest': '/tmp' }).single('audio');
const audio_utilies = audio_utils.audio_utils();

router.get('/say', function (req, res) {

    var text = req.query.text;

    if (text == undefined) {

        res.status(400);

        res.send({
            'error': true,
            'message': 'text not specifed (query param "text" empty)'
        });
    }
    else {

        say.speak(text);

        res.send({
            'error': false,
            'message': text
        });
    }

    res.end();
    return;
});

router.post('/play', function (req, res) {

    let return_data = {
        'error': false,
        'message': ''
    };

    upload(req, res, function (err) {

        if (err instanceof multer.MulterError) {

            res.status(412);
            res.end();
            return;
        }

        let play_err = audio_utilies.play_wav(req.file.path);
        fs.unlink(req.file.path, function (err) {

        });

        switch (play_err) {

            case 0:

                res.status(200);
                break;
            case 1:

                res.status(500);
                return_data.error = true;
                return_data.message = "No such file or directory";
                break;
            case -1:

                res.status(500);
                return_data.error = true;
                return_data.message = "Error with aplay";
                break;
        }
        res.send(return_data);
        res.end();

        return;
    })
});
module.exports = router;