const path = require('path');
// const nodeExternals = require("webpack-node-externals");
const webpack = require('webpack');

module.exports = {
    target: 'node',
    entry: path.resolve(__dirname, 'src', 'index.js'),
    // externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        filename: 'index.js'
    },
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader' }
        ]
    },
    plugins: [
        // new webpack.IgnorePlugin(/require\(\'iview-weapp\/package\.json\')/),
    ]
};