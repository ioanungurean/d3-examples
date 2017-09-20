const path = require('path');

class AliasProvider {
  static getWebC () {
    return { // webcomponents aliases
      terrain: path.resolve('src/webcomponents/terrain/'),
      character: path.resolve('src/webcomponents/character/'),
      weather: path.resolve('src/webcomponents/weather/')
    };
  }

  static getModules () {
    return { // modules aliases
      app: path.resolve('src/modules/app/')
    };
  }

  static getServices () {
    return { // services aliases
      // colorService: path.resolve('src/libs/color/'),
      // d3Service: path.resolve('src/libs/d3/'),
      // underscoreService: path.resolve('src/libs/underscore/')
    };
  }

  static getApis () {
    return {

    };
  }
}
module.exports = AliasProvider;
