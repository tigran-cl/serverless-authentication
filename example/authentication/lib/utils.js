'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Utils = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Utilities for Serverless Authentication
 */

var Utils = exports.Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: 'redirectUrlBuilder',

    /**
     * Creates redirectUrl
     * @param url {string} url base
     * @param provider {string} provider e.g. facebook
     */
    value: function redirectUrlBuilder(url, provider) {
      return url.replace(/{provider}/g, provider);
    }

    /**
     * Creates url with params
     * @param url {string} url base
     * @param params {object} url params 
     */

  }, {
    key: 'urlBuilder',
    value: function urlBuilder(url, params) {
      return url + '?' + this.urlParams(params);
    }

    /**
     * Creates &amp; separated params string 
     * @param params {object}
     */

  }, {
    key: 'urlParams',
    value: function urlParams(params) {
      var result = [];
      for (var key in params) {
        result.push(key + '=' + params[key]);
      }
      return result.join('&');
    }

    /** 
     * Creates Json Web Token with data
     * @param data {object}
     * @param config {object} with token_secret --> change to secret
     */

  }, {
    key: 'createToken',
    value: function createToken(data, secret) {
      return _jsonwebtoken2.default.sign(data, secret);
    }

    /** 
     * Reads Json Web Token and returns object
     * @param token {string}
     * @param config {object} with token_secret --> change to secret
     */

  }, {
    key: 'readToken',
    value: function readToken(token, secret) {
      return _jsonwebtoken2.default.verify(token, secret);
    }

    /**
     * Creates token response and triggers callback
     * @param data {object}
     * @param config {object}
     * @param callback {function} callback function e.g. context.done
     */

  }, {
    key: 'tokenResponse',
    value: function tokenResponse(data, config, callback) {
      var url = this.urlBuilder(config.redirect_client_uri, {
        id: data.id,
        token: this.createToken(data, config.token_secret)
      });
      return callback(null, { url: url });
    }

    /**
     * Generates Policy for AWS Api Gateway custom authorize
     * @param principalId {string} data for principalId field
     * @param effect {string} 'Allow' or 'Deny'
     * @param resource {string} method arn e.g. event.methodArn (arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>)
     */

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

  return Utils;
}();