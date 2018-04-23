'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Default provider
 */
var Provider = function () {
  function Provider(config) {
    _classCallCheck(this, Provider);

    this.config = config;
  }

  _createClass(Provider, [{
    key: 'signin',
    value: function signin(_ref) {
      var _this = this;

      var signin_uri = _ref.signin_uri,
          scope = _ref.scope,
          state = _ref.state,
          response_type = _ref.response_type,
          access_type = _ref.access_type,
          prompt = _ref.prompt;

      return new _bluebird2.default(function (resolve, reject) {
        var _config = _this.config,
            id = _config.id,
            redirect_uri = _config.redirect_uri;

        var params = {
          client_id: id,
          redirect_uri: redirect_uri
        };
        if (response_type) {
          params.response_type = response_type;
        }
        if (scope) {
          params.scope = scope;
        }
        if (state) {
          params.state = state;
        }
        if (access_type) {
          params.access_type = access_type;
        }
        if (prompt) {
          params.prompt = prompt;
        }
        if (!params.client_id || !params.redirect_uri) {
          var message = 'Invalid sign in params. ' + params.client_id + ' ' + params.redirect_uri;
          return reject(new Error(message));
        }
        var url = _utils.Utils.urlBuilder(signin_uri, params);
        return resolve({ url: url });
      });
    }
  }, {
    key: 'callback',
    value: function callback(_ref2, _ref3, additionalParams) {
      var code = _ref2.code,
          state = _ref2.state;

      var _this2 = this;

      var authorization_uri = _ref3.authorization_uri,
          profile_uri = _ref3.profile_uri,
          profileMap = _ref3.profileMap,
          authorizationMethod = _ref3.authorizationMethod;

      return new _bluebird2.default(function (resolveAll) {
        var authorization = additionalParams.authorization,
            profile = additionalParams.profile;
        var _config2 = _this2.config,
            id = _config2.id,
            redirect_uri = _config2.redirect_uri,
            secret = _config2.secret,
            provider = _config2.provider;


        var attemptAuthorize = function attemptAuthorize() {
          return new _bluebird2.default(function (resolve, reject) {
            var mandatoryParams = {
              client_id: id,
              redirect_uri: redirect_uri,
              client_secret: secret,
              code: code
            };
            var payload = Object.assign(mandatoryParams, authorization);
            if (authorizationMethod === 'GET') {
              var url = _utils.Utils.urlBuilder(authorization_uri, payload);
              _request2.default.get(url, function (error, response, accessData) {
                if (error) {
                  return reject(error);
                }
                return resolve(accessData);
              });
            } else {
              _request2.default.post(authorization_uri, { form: payload }, function (error, response, accessData) {
                if (error) {
                  return reject(error);
                }
                return resolve(accessData);
              });
            }
          });
        };

        var createMappedProfile = function createMappedProfile(accessData) {
          return new _bluebird2.default(function (resolve, reject) {
            if (!accessData) {
              reject(new Error('No access data'));
            }

            var _JSON$parse = JSON.parse(accessData),
                access_token = _JSON$parse.access_token,
                refresh_token = _JSON$parse.refresh_token;

            var url = _utils.Utils.urlBuilder(profile_uri, Object.assign({ access_token: access_token }, profile));
            _request2.default.get(url, function (error, httpResponse, profileData) {
              if (error) {
                reject(error);
              } else if (!profileData) {
                reject(new Error('No profile data'));
              } else {
                var profileJson = JSON.parse(profileData);
                profileJson.provider = provider;
                profileJson.at_hash = access_token;
                profileJson.offline_access = refresh_token || '';
                var mappedProfile = profileMap ? profileMap(profileJson) : profileJson;
                resolve(mappedProfile);
              }
            });
          });
        };

        attemptAuthorize().then(createMappedProfile).then(function (data) {
          return resolveAll(Object.assign({ state: state }, data));
        });
      });
    }
  }]);

  return Provider;
}();

module.exports = {
  Provider: Provider
};