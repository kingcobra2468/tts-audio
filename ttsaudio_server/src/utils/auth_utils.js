/**
 * Decodes a base64 encoded username:password pair
 * @param {string} base64Str
 * @returns {Object}
 */
const getCredentials = (base64Str) => {
  // matching string for getting base64 string
  const base64Scanner = RegExp('^BASIC ([A-Z]|[a-z]|[0-9]|[+/=]){1,}$');

  if (!base64Scanner.test(base64Str)) {
    throw new Error('BASE64 encoded input is incorrectly formatted.');
  }

  const base64Credentials = base64Str.split(' ')[1]; // get the base64 string
  // eslint-disable-next-line new-cap
  const decodedCredentials = new Buffer.from(base64Credentials, 'base64').toString();
  let [username, password] = ['', ''];

  if (decodedCredentials !== ':') { // checking if decoding took place successfully
    // eslint-disable-next-line new-cap
    [username, password] = new Buffer.from(base64Credentials, 'base64').toString().split(':');
  }

  return {
    username,
    password,
  };
};

module.exports = { getCredentials };
