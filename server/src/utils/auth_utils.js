/**
 * Decodes a base64 encoded username:password pair
 * @param {string} base64_str 
 * @returns {Object}
 */
const get_credentials = function (base64_str) {

    let base64_regex_pattern = RegExp('^BASIC ([A-Z]|[a-z]|[0-9]|[+/=]){1,}$'); // matching string for getting base64 string

    if (!base64_regex_pattern.test(base64_str)) {
        throw new Error('BASE64 encoded input is incorrectly formatted.');
    }

    let base64_credentials = base64_str.split(' ')[1] // get the base64 string
    let decoded_base64_credentials = new Buffer.from(base64_credentials, 'base64').toString();
    let [username, password] = ['', ''];

    if (decoded_base64_credentials != ':') { // checking if decoding took place successfully
        [username, password] = new Buffer.from(base64_credentials, 'base64').toString().split(':');
    }

    return {
        username: username,
        password: password
    }
};

module.exports = { get_credentials }