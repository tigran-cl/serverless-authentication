'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Config class
 */
var Config = function () {
  function Config() {
    var _this = this;

    _classCallCheck(this, Config);

    var data = process.env;
    this.providers = {};
    Object.keys(data).forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        var value = data[key];
        var providerItem = /PROVIDER_(.*)?_(.*)?/g.exec(key);
        if (providerItem) {
          var provider = providerItem[1].toLowerCase();
          var type = providerItem[2].toLowerCase();
          if (!_this.providers[provider]) {
            _this.providers[provider] = {};
          }
          _this.providers[provider][type] = value;
        } else if (key === 'REDIRECT_URI') {
          _this.redirect_uri = value;
        } else if (key === 'REDIRECT_CLIENT_URI') {
          _this.redirect_client_uri = value;
        } else if (key === 'TOKEN_SECRET') {
          _this.token_secret = value;
        }
      }
    });
  }

  _createClass(Config, [{
    key: 'getConfig',
    value: function getConfig(provider) {
      var result = {};
      if (provider) {
        var configProvider = provider.replace(/-/g, '_');
        result = this.providers[configProvider] ? this.providers[configProvider] : {};
        result.redirect_uri = _utils.Utils.redirectUrlBuilder(this.redirect_uri, provider);
        result.redirect_client_uri = _utils.Utils.redirectUrlBuilder(this.redirect_client_uri, provider);
        result.provider = provider;
      }
      result.token_secret = this.token_secret;
      return result;
    }
  }]);

  return Config;
}();

/**
 * @param provider {string} oauth provider name e.g. facebook or google
 */


function config(_ref) {
  var provider = _ref.provider,
      host = _ref.host,
      stage = _ref.stage;

  if (!process.env.REDIRECT_URI) {
    process.env.REDIRECT_URI = 'https://' + host + '/' + stage + '/authentication/callback/{provider}';
  }
  return new Config().getConfig(provider);
}

module.exports = {
  config: config
};