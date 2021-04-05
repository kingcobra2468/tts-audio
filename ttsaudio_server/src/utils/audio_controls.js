const { exec, execSync } = require('child_process');

/**
 * Set the volume level of the machine to a new level
 * @param {number} volume_level 
 * @returns {boolean}
 */
const set_volume = function (volume_level) {

    volume_level = parseInt(volume_level);

    if (isNaN(volume_level)) return false; // check if volume_level is numerical
    if (100 < volume_level) volume_level = 100; // check if level within range (upperbound)
    if (0 > volume_level) volume_level = 0; // check if level within range (lowerbound)

    exec('amixer set Master ' + parseInt(volume_level) + '%', (err, stdout, stderr) => {
        if (err) throw new Error('amixer not installed');
    });

    return true;
}

/**
 * Gets the current volume of the machine
 * @returns {number}
 */
const get_volume = function () {

    var regex = new RegExp('[0-9]{1,3}%');

    try {

        let raw = execSync('amixer get Master', timeout = 2000); // get volume via subprocess
        let val = regex.exec(raw)[0].replace('%', '');
        return parseInt(val);
    }
    catch (error) { // error in getting volume level
        return -1;
    }
}

/**
 * Play a wav file via the speakers
 * @param {string} file_name 
 * @returns {number}
 */
const play_wav = function (file_name) {

    if (typeof (file_name) != 'string') return false; // check for correct type

    execSync('aplay -Pq ' + file_name, (error) => {
        console.log(error)

        // handle specific error where the wav file wasnt found on the system
        let file_exists_error = error.stderr.toString().search('No such file or directory');
        return file_exists_error ? 1 : -1; // 1 : no such file error, -1 : other error
    }, (stdout) => {
        return 0;
    }); // play via subprocess

    return 0;
}

module.exports = { set_volume, get_volume, play_wav }