"use strict";

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
      var providerItem = /PROVIDER_(.*)?_(.*)?/g.exec(key);
      if (providerItem) {
        var provider = providerItem[1].toLowerCase();
        var type = providerItem[2].toLowerCase();
        if (!this.providers[provider]) {
          this.providers[provider] = {};
        }
        this.providers[provider][type] = data[key];
      }
    }
  }

  _createClass(Config, [{
    key: "getConfig",
    value: function getConfig(provider) {
      var result = this.providers[provider];
      if (!result) {
        throw new Error("No provider " + provider + " defined");
      }
      return result;
    }
  }]);

  return Config;
}();

function getConfig(provider) {
  var c = new Config();
  return c.getConfig(provider);
}