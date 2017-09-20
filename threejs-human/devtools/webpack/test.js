const path = require('path');

module.exports = function (config) {
  return {
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
