const path = require('path');
const webpack = require('webpack');
/**
 * Plugins
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (config) {
  return {
    entry: {
      app: [
        path.resolve('src/main.js')
      ],
      three: ['three']
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'bundle.css',
        allChunks: true
      }),
      new HtmlWebpackPlugin({
        template: path.resolve('src/index.html'),
        inject: 'head'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['app', 'three']
      }),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            { loader: 'html-loader' }
          ]
        },
        {
          test: /\.(jpg|png)$/,
          use: [
            { loader: 'file-loader' }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [
                  path.resolve('node_modules/xbem/src/'),
                  path.resolve('src/themes/shared'),
                  path.resolve('src/themes/' + config.theme)
                ]
              }
            }
          ]
        }
      ]
    }
  };
};
