const path = require('path');
const nodeExternals = require('webpack-node-externals');

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
};