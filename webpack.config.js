const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Webpack Config
const webpackConfig = {
    entry: {
        main: './src/index.ts',
    },

    output: {
        path: './dist',
        publicPath: '/'
    },

    resolve: {
        extensions: ['.vue', '.js']
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: 'body'
        })
    ],

    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {loader: 'vue-loader'}
                ]
            }
        ]
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: {
            index: '/index.html'
        },
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunk: false
        },
        host: '0.0.0.0',
        port: 3000
    },
};

module.exports = webpackConfig;
