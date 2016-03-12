'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getConfig = getConfig;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function () {
  function Config() {
    _classCallCheck(this, Config);

    var data = process.env;
    this.providers = {};
    for (var key in data) {
      var value = data[key];
      var providerItem = /PROVIDER_(.*)?_(.*)?/g.exec(key);
      if (providerItem) {
        var provider = providerItem[1].toLowerCase();
        var type = providerItem[2].toLowerCase();
        if (!this.providers[provider]) {
          this.providers[provider] = {};
        }
        this.providers[provider][type] = value;
      } else if (key === 'REDIRECT_URI') {
        this.redirect_uri = value;
      } else if (key === 'REDIRECT_CLIENT_URI') {
        this.redirect_client_uri = value;
      } else if (key === 'TOKEN_SECRET') {
        this.token_secret = value;
      }
    }
  }

  _createClass(Config, [{
    key: 'getConfig',
    value: function getConfig(provider) {
      var result = this.providers[provider] ? this.providers[provider] : {};
      result.redirect_uri = this.redirect_uri.replace(/{provider}/g, provider);
      result.redirect_client_uri = this.redirect_client_uri.replace(/{provider}/g, provider);
      result.token_secret = this.token_secret;
      return result;
    }
  }]);

  return Config;
}();

function getConfig(provider) {
  var c = new Config();
  return c.getConfig(provider);
}