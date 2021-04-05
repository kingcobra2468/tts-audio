const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack')
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
    mode: 'development',
    target: 'node',
    externals: [nodeExternals()],
    entry: './src/index.js',
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
        alias: {
            '@api': path.resolve(__dirname, './src/api'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@middleware': path.resolve(__dirname, './src/middleware'),
            '@': path.resolve(__dirname, './src/'),
        }
    },
    output: {
        filename: 'speech_server.js',
        path: __dirname + '/dist',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.parsed)
        })
    ]
};