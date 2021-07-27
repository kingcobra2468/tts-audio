const { exec, execSync } = require('child_process');

/**
 * Set the volume level of the machine to a new level
 * @param {number} volumeLevel
 * @returns {boolean}
 */
const setVolume = (volumeLevel) => {
  let volume = parseInt(volumeLevel, 10);

  if (Number.isNaN(volume)) return false; // check if volume_level is numerical
  if (volume > 100) volume = 100; // check if level within range (upperbound)
  if (volume < 0) volume = 0; // check if level within range (lowerbound)

  exec(`amixer set Master ${parseInt(volume, 10)}%`, (err, _0, _1) => {
    if (err) throw new Error('amixer not installed');
  });

  return true;
};

/**
 * Gets the current volume of the machine
 * @returns {number}
 */
const getVolume = () => {
  const regex = new RegExp('[0-9]{1,3}%');

  try {
    const raw = execSync('amixer get Master', { timeout: 2000 }); // get volume via subprocess
    const val = regex.exec(raw)[0].replace('%', '');
    return parseInt(val, 10);
  } catch (error) { // error in getting volume level
    return -1;
  }
};

/**
 * Play a wav file via the speakers
 * @param {string} filename
 * @returns {number}
 */
const playWAV = (filename) => {
  if (typeof (filename) !== 'string') return false; // check for correct type

  execSync(`aplay -Pq ${filename}`, (error) => {
    // eslint-disable-next-line no-console
    console.log(error);

    // handle specific error where the wav file wasnt found on the system
    const fileExistsError = error.stderr.toString().search('No such file or directory');
    return fileExistsError ? 1 : -1; // 1 : no such file error, -1 : other error
  }, (_) => 0); // play via subprocess

  return 0;
};

module.exports = { setVolume, getVolume, playWAV };
