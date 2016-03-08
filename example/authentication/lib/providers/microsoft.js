'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signin = signin;
exports.callback = callback;

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _request = require('../request');

var _request2 = _interopRequireDefault(_request);

var _profile = require('../profile');

var _profile2 = _interopRequireDefault(_profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function signin(event, config, callback) {
  var params = {
    client_id: config.microsoft.id,
    redirect_uri: _utils2.default.redirectUrlBuilder(event, config),
    scope: 'wl.basic wl.emails',
    response_type: 'code'
  };
  var url = _utils2.default.urlBuilder('https://login.live.com/oauth20_authorize.srf', params);
  callback(null, { url: url });
}

function callback(event, config, callback) {
  var params = {
    client_id: config.microsoft.id,
    redirect_uri: _utils2.default.redirectUrlBuilder(event, config),
    client_secret: config.microsoft.secret,
    code: event.code,
    grant_type: 'authorization_code'
  };
  _async2.default.waterfall([function (callback) {
    (0, _request2.default)({ url: 'https://login.live.com/oauth20_token.srf', params: params, method: 'POST' }, callback);
  }, function (data, callback) {
    var p = {
      url: 'https://apis.live.net/v5.0/me',
      params: {
        access_token: data.access_token
      }
    };
    (0, _request2.default)(p, function (err, response) {
      if (!err) {
        console.log(response);
        callback(null, responseToProfile(response));
      } else {
        callback(err);
      }
    });
  }], function (err, data) {
    callback(err, data);
  });
}

function responseToProfile(response) {
  return new _profile2.default({
    id: response.id,
    name: response.name,
    email: response.emails.preferred,
    picture: 'https://apis.live.net/v5.0/' + response.id + '/picture',
    provider: 'microsoft'
  });
}