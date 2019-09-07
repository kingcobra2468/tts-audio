const {exec, execSync} = require('child_process');

module.exports.audio_utils = function() {

    var set_volume = function(volume_level) {

        volume_level = parseInt(volume_level);
    
        if (isNaN(volume_level)) return false;
        if (100 < volume_level) volume_level = 100;
        if (0 > volume_level) volume_level = 0;
    
        exec('amixer set Master ' + parseInt(volume_level) + "%", (err, stdout, stderr) => {
            
            if (err) throw new Error("amixer not installed");
        });

        return true;
    }

    var get_volume = function() {

        var regex = new RegExp ("[0-9]{1,3}%");

        try {

            let raw = execSync('amixer get Master', timeout=2000);
            let val = regex.exec(raw)[0].replace("%", "");  
            return parseInt(val);
        }
        catch (error) {

            return -1;
        }
    }

    return {

        set_volume : function(volume_level) {
            return set_volume(volume_level);
        },
        get_volume : function() {
            return get_volume();
        }
    }
};


