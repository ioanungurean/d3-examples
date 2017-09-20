const path = require('path');
const webpack = require('webpack');
/**
 * Plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
/**
 * Env. vars
 */
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';
const host = 'http://' + hostname + ':' + port;
const assetHost = process.env.ASSET_HOST || host + '/';

module.exports = function (config) {
  return {
    entry: {
      app: [
        path.resolve('src/main.js'),
        'webpack-dev-server/client?' + host,
        'webpack/hot/only-dev-server'
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('src/index.html'),
        inject: 'head'
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'inline-source-map',
    devServer: {
      inline: true,
      port: port,
      publicPath: assetHost, // Make sure publicPath always starts and ends with a forward slash.
      contentBase: '/public/'
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            { loader: 'html-loader' }
          ]
        },
        {
          test: /\.json$/,
          use: [
            { loader: 'raw-loader' }
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
