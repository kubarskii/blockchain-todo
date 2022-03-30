const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

const config = {
    mode: 'production',
    entry: ['./src/index.js'],
    devtool: 'eval',
    resolve: {
        extensions: ['.js']
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        libraryTarget: "umd",
        asyncChunks: true,
        chunkFilename: '[id].js',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9001,
    },
    module: {},
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: path.resolve(__dirname, 'public'), to: ''},
            ]
        })
    ]
}

module.exports = config
