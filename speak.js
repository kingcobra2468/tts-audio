const express = require('express');
const say = require('say');
var router = express.Router();

router.get('/say', function(req, res) {

    var text = req.query.text;

    if (text == undefined) {

        res.status(400);

        res.send({
            "error" : true,
            "message" : "text not specifed (query param 'text' empty)"
        });
    }
    else {

        say.speak(text);

        res.send({
            "error" : false,
            "message" : text
        });
    }

    res.end();
    return;
});

// auth hint: kak zavut cabaku pudel?
module.exports = router;