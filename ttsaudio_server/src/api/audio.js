const express = require('express');
const { get_volume, set_volume } = require('@utils/audio_controls');

var router = express.Router();

router.get('/get-volume', function (req, res) {

    let audio_level = get_volume(); // get volume level

    res.send({
        'level': audio_level,
        'error': (audio_level == -1) ? true : false
    });
});

router.put('/set-volume', function (req, res) {

    let audio_level = parseInt(req.query.level);

    if (req.query.level == undefined) { //level query-arg doesnt exist 

        res.send({
            'error': true,
            'message': 'volume not specifed (query param "level" empty)'
        });
        res.end();

        return
    }
    else if (isNaN(audio_level)) { // level query-arg isnt valid type

        res.send({
            'error': true,
            'message': 'volume incorrect type (query param "level" not number)'
        });
        res.end();

        return
    }

    let return_status = set_volume(audio_level); // set the volume

    res.send({
        'level': audio_level,
        'error': (!return_status) ? true : false
    });
});

module.exports = router;