'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: 'redirectUrlBuilder',
    value: function redirectUrlBuilder(event, config) {
      return config.callback.replace('{provider}', event.provider);
    }
  }, {
    key: 'urlBuilder',
    value: function urlBuilder(url, params) {
      return url + '?' + this.urlParams(params);
    }
  }, {
    key: 'urlParams',
    value: function urlParams(params) {
      var p = _lodash2.default.map(params, function (value, key) {
        return key + '=' + value;
      });
      return p.join('&');
    }
  }, {
    key: 'createToken',
    value: function createToken(client_id, config) {
      var token = _jsonwebtoken2.default.sign({ client_id: client_id, expires: new Date().getTime() + 60 * 1000 }, config.secret);
      return token;
    }
  }, {
    key: 'readToken',
    value: function readToken(token, config) {
      return _jsonwebtoken2.default.verify(token, config.secret);
    }
  }, {
    key: 'tokenResponse',
    value: function tokenResponse(context, username, config) {
      var url = this.urlBuilder(config.redirect, {
        username: username,
        token: this.createToken(username, config)
      });
      context.succeed({ url: url });
    }
  }]);

  return Utils;
}();

exports.default = Utils;