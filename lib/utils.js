'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = function () {
  function utils() {
    _classCallCheck(this, utils);
  }

  _createClass(utils, null, [{
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
      var result = [];
      for (var key in params) {
        result.push(key + '=' + params[key]);
      }
      return result.join('&');
    }
  }, {
    key: 'createToken',
    value: function createToken(data, config) {
      return _jsonwebtoken2.default.sign(data, config.token_secret);
    }
  }, {
    key: 'readToken',
    value: function readToken(token, config) {
      return _jsonwebtoken2.default.verify(token, config.token_secret);
    }
  }, {
    key: 'tokenResponse',
    value: function tokenResponse(data, config, callback) {
      var url = this.urlBuilder(config.redirect_client_uri, {
        id: data.id,
        token: this.createToken(data, config)
      });
      callback(null, { url: url });
    }
  }, {
    key: 'generatePolicy',
    value: function generatePolicy(principalId, effect, resource) {
      var authResponse = {};
      authResponse.principalId = principalId;
      if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];

        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
      }
      return authResponse;
    }
  }]);

  return utils;
}();

exports.default = utils;