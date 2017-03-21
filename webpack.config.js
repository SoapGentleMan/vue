const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const isProd = !(process.env.NODE_ENV === 'development');
const isRelease = process.env.NODE_ENV === 'release';

module.exports = function makeWebpackConfig() {
  let config = {};

  config.mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

  config.resolve = {
    modules: ['node_modules'],
    extensions: ['.vue', '.ts', '.js']
  };

  config.entry = {
    main: './src/main.ts'
  };

  config.output = {
    path: path.join(__dirname, './dist'),
    publicPath: isProd ? (isRelease ? '/' : '/') : '/',
    filename: isProd ? 'js/[name].[hash].js' : '[name].bundle.js',
    chunkFilename: isProd ? 'js/[name].[hash].js' : '[name].bundle.js'
  };

  config.devtool = isProd ? false : 'inline-source-map';

  config.module = {
    rules: [
      // 文件检查
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          failOnHint: true
        },
        exclude: /node_modules/
      },
      {
        test: /\.(vue|jsx?)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          failOnWarning: true
        },
        exclude: /node_modules/
      },
      // 文件检查结束
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // 下面是为了tsx写法准备
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: { appendTsxSuffixTo: [/\.vue$/] }
          }
        ],
        exclude: [/node_modules/]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: [
            {loader: 'style-loader', options: {sourceMap: !isProd}}
          ],
          use: [
            {loader: 'css-loader', options: {modules: true, sourceMap: !isProd}},
            {loader: 'postcss-loader'},
            {loader: 'sass-loader'}
          ]
        })
      },
      // tsx写法准备结束
      // 下面是为了原始的vue写法准备
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: [
            {loader: 'style-loader', options: {sourceMap: !isProd}}
          ],
          use: [
            // {loader: 'css-loader', options: {modules: true, sourceMap: !isProd}},    // 带css module版本，style标签上需加上module
            {loader: 'css-loader', options: {sourceMap: !isProd}},
            {loader: 'postcss-loader'}
          ]
        }),
        exclude: [/global\.css/, /node_modules/]
      },
      // 原始写法准备结束
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: [
            {loader: 'style-loader', options: {sourceMap: !isProd}}
          ],
          use: [
            {loader: 'css-loader', options: {sourceMap: !isProd}},
            {loader: 'postcss-loader'}
          ]
        }),
        include: [/global\.css/]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: [
            {loader: 'style-loader', options: {sourceMap: !isProd}}
          ],
          use: [
            {loader: 'css-loader'}
          ]
        }),
        include: [/node_modules/]
      },
      {
        test: /\.(ico|woff|woff2|ttf|eot|otf)(\?.+)?$/,
        use: [
          {loader: 'file-loader'}
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              outputPath: isProd ? 'css/img' : ''
            }
          }
        ]
      },
      // {
      //   test: /\.html/,
      //   use: [
      //     {loader: 'html-loader'}  // 用了这个没法使用htmlwebpackplugin的变量替代功能，可不用，要用对test做更严格的匹配，避免对index.html进行load
      //   ]
      // }
    ]
  };

  config.externals = {};

  config.plugins = [];

  config.plugins.push(
    new ExtractTextPlugin({
      filename: isProd ? 'css/[name].[hash].css' : '[name].bundle.css'
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: 'body',
      favicon: './src/favicon.ico',
      templateParameters: {
        url: isProd ? JSON.stringify('') : JSON.stringify('')
      }
    }),

    new webpack.DefinePlugin({
      DOMAIN: JSON.stringify(isProd ? (isRelease ? '' : '/web') : ''),
      SHORT: JSON.stringify(isProd ? (isRelease ? '' : '/web') : ''),
      ACCOUNT: JSON.stringify(isProd ? (isRelease ? '' : '/web') : ''),
      WEB: JSON.stringify(isProd ? (isRelease ? '' : '/web') : ''),
      DRIVE: JSON.stringify(isProd ? (isRelease ? '' : '/web') : ''),
      HTTPS: JSON.stringify(isRelease),
      isProd: JSON.stringify(isProd),
      isRelease: JSON.stringify(isRelease)
    }),

    new VueLoaderPlugin(),

    new StyleLintPlugin({
      files: ['**/*.{vue,css,scss}']
    })
  );

  if (isProd) {
    config.plugins.push(
      new OptimizeCssAssetsPlugin()
    )
  }

  config.optimization = {
    minimizer: [
      new UglifyPlugin({
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            warnings: false,
            dead_code: true,
            unused: true
          }
        },
        extractComments: false,
        sourceMap: false,
      })
    ],
    splitChunks: {
      cacheGroups: {
        common: {
          name: 'common',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  };

  config.devServer = {
    contentBase: path.join(__dirname, './dist'),
    historyApiFallback: {
      index: `/index.html`,
    },
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false,
    },
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 8081,
    proxy: {
      '/test': {
        target: 'https://test.wps.cn',
        secure: false,
        changeOrigin: true
      }
    }
  };

  return config;
};
