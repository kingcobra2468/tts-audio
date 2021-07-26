const path = require('path');


module.exports = {
  env: {
    es2021: true,
    node: true,
    commonjs: true,
  },
  extends: [
    'airbnb-base',
    'plugin:node/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'node/no-missing-require': 'off',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, 'webpack.config.js'),
      },
    },
  },
  ignorePatterns: ['dist/*'],
};
