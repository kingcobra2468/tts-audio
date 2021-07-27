require('dotenv').config();

const config = {};

// Authentication
config.USERNAME = process.env.TTS_USERNAME || 'username';
config.PASSWORD = process.env.TTS_PASSWORD || 'password';
config.AUTH_ENABLED = process.env.TTS_AUTH_ENABLED || false;

// Logger
config.LOG_FILE = './events.log';

// Server Config
config.PORT = process.env.TTS_PORT || 8081;
config.HOST = process.env.TTS_HOST || '127.0.0.1';

module.exports = { ...config };
