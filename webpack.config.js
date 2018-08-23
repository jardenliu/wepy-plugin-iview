const path = require('path');
// const nodeExternals = require("webpack-node-externals");
const webpack = require('webpack');

module.exports = {
    target: 'node',
    entry: ['babel-polyfill', path.resolve(__dirname, 'src', 'index.js')],
    externals: {
        'postcss': 'postcss',
        'postcss-px2units': 'postcss-px2units'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs',
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