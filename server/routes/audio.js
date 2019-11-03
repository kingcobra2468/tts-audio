const express = require('express');
const audio_utils = require('../utils/audio_utils');

const audio_utilies = audio_utils.audio_utils();
var router = express.Router();

router.get('/get-volume', function (req, res){

    let audio_level = audio_utilies.get_volume();
    
    res.send({
        'level' : audio_level,
        'error' : (audio_level == -1) ? true : false
    });
});

router.get('/set-volume', function (req, res) {

    let audio_level = parseInt(req.query.level);

    if (req.query.level == undefined) {

        res.send({
            'error' : true,
            'message' : 'volume not specifed (query param "level" empty)'
        });
    }
    else if (isNaN(audio_level)) {

        res.send({
            'error' : true,
            'message' : 'volume incorrect type (query param "level" not number)'
        });
    }
    else {

        let return_status = audio_utilies.set_volume(audio_level);
    
        res.send({
            'level' : audio_level,
            'error' : (!return_status) ? true : false
        });
    }

    res.end();
    return;
});

module.exports = router;