const path = require('path');
const AliasProvider = require('./webpack/alias');

module.exports = function (config) {
  let _CONFIG_ = { // default config if nothing is passed from CLI
    environment: (config && config.environment) ? config.environment : 'dev',
    theme: (config && config.theme) ? config.theme : 'default'
  };

  return Object.assign({
    output: {
      path: path.resolve('public'),
      filename: '[name].js',
      chunkFilename: '[chunkhash].[name].js'
    },
    resolveLoader: {
      modules: ['node_modules']
    },
    resolve: {
      modules: [
        'devtools',
        'src',
        'e2e',
        'node_modules'
      ],
      extensions: ['.js', '.json', '.scss', '.css', '.html', '.jpg', '.png'],
      alias: Object.assign({},
        AliasProvider.getWebC(),
        AliasProvider.getModules(),
        AliasProvider.getServices()
      )
    }
  }, require('./webpack/' + _CONFIG_.environment)(_CONFIG_));
};
