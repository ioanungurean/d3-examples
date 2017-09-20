const WebpackConfig = require('./webpack.config.js');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    port: 9876,
    colors: true,
    files: [
      { pattern: './karma-shim.js'}
    ],
    preprocessors: {
      './karma-shim.js': ['webpack']
    },
    webpack: WebpackConfig({ environment: 'test' }),
    webpackServer: { noInfo: true },
    browsers: ['Chrome'],
    singleRun: true
  });
};
