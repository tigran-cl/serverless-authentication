'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.config = config;

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Config class
 */

var Config = function () {
  function Config(envVars) {
    _classCallCheck(this, Config);

    this.providers = {};
    for (var key in envVars) {
      if (envVars.hasOwnProperty(key)) {
        var value = envVars[key];
        var providerItem = /provider(.*)?(Id|Secret)/g.exec(key);
        if (providerItem) {
          var providerName = providerItem[1].toLowerCase();
          var type = providerItem[2].toLowerCase();
          if (!this.providers[providerName]) {
            this.providers[providerName] = {};
          }
          this.providers[providerName][type] = value;
        } else {
          this[key] = value;
        }
      }
    }
  }

  _createClass(Config, [{
    key: 'getConfig',
    value: function getConfig(provider) {
      var result = {};
      if (provider) {
        var configProvider = provider.replace(/_/g, '-');
        result = this.providers[configProvider] ? this.providers[configProvider] : {};
        result.redirectUri = _utils.Utils.redirectUrlBuilder(this.redirectUri, provider);
        result.redirectClientUri = _utils.Utils.redirectUrlBuilder(this.redirectClientUri, provider);
        result.provider = provider;
      }
      result.tokenSecret = this.tokenSecret;
      return result;
    }
  }]);

  return Config;
}();

/**
 * @param provider {string} oauth provider name e.g. facebook or google
 */


function config(options, envVars) {
  var provider = void 0;
  var host = void 0;
  var stage = void 0;
  // fallback -- remove on version upgrade
  if (typeof options === 'string') {
    provider = options;
  } else {
    provider = options.provider;
    host = options.host;
    stage = options.stage;
  }

  if (!envVars.redirectUri) {
    envVars.redirectUri = 'https://' + host + '/' + stage + '/authentication/callback/{provider}';
  }

  return new Config(envVars).getConfig(provider);
}