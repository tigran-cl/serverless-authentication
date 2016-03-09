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

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _profile = require('../profile');

var _profile2 = _interopRequireDefault(_profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function signin(event, config, callback) {
  var params = {
    client_id: config.facebook.id,
    redirect_uri: _utils2.default.redirectUrlBuilder(event, config),
    scope: 'email'
  };
  var url = _utils2.default.urlBuilder('https://www.facebook.com/dialog/oauth', params);
  callback(null, { url: url });
}

function callback(event, config, callback) {
  _async2.default.waterfall([function (callback) {
    var options = {
      url: _utils2.default.urlBuilder('https://graph.facebook.com/v2.3/oauth/access_token', {
        client_id: config.facebook.id,
        redirect_uri: _utils2.default.redirectUrlBuilder(event, config),
        client_secret: config.facebook.secret,
        code: event.code
      })
    };
    (0, _request2.default)(options, callback);
  }, function (response, data, callback) {
    var d = JSON.parse(data);
    var options = {
      url: _utils2.default.urlBuilder('https://graph.facebook.com/me', {
        fields: 'id,name,picture,email',
        access_token: d.access_token
      })
    };
    (0, _request2.default)(options, function (error, response, data) {
      if (!error) {
        callback(null, responseToProfile(JSON.parse(data)));
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
    email: response.email,
    picture: !response.picture.data.is_silhouette ? response.picture.data.url : null,
    provider: 'facebook'
  });
}