const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
  mode: 'development',
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/index.js',
  resolve: {
    modules: ['src', path.resolve(__dirname, 'node_modules'), 'node_modules'],
    alias: {
      '@api': path.resolve(__dirname, 'src', 'api'),
      '@utils': path.resolve(__dirname, 'src', 'utils'),
      '@middleware': path.resolve(__dirname, 'src', 'middleware'),
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    filename: 'speech_server.js',
    path: path.join(__dirname, '/dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed),
    }),
    new ESLintPlugin({ fix: true, extensions: ['js'] }),
  ],
};
