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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function signin(event, config, callback) {
  var params = {
    client_id: config.facebook.id,
    redirect_uri: _utils2.default.redirectUrlBuilder(event, config)
  };
  var url = _utils2.default.urlBuilder('https://www.facebook.com/dialog/oauth', params);
  callback(null, { url: url });
}

function callback(event, config, callback) {
  var params = {
    client_id: config.facebook.id,
    redirect_uri: _utils2.default.redirectUrlBuilder(event, config),
    client_secret: config.facebook.secret,
    code: event.code
  };
  _async2.default.waterfall([function (callback) {
    (0, _request2.default)({ url: 'https://graph.facebook.com/v2.3/oauth/access_token', params: params }, callback);
  }, function (data, callback) {
    var p = {
      url: 'https://graph.facebook.com/me',
      params: {
        fields: 'id',
        access_token: data.access_token
      }
    };
    (0, _request2.default)(p, function (err, res) {
      var result = data;
      result.client_id = res.id;
      callback(null, result);
    });
  }], function (err, data) {
    callback(err, { url: _utils2.default.urlBuilder(config.redirect, { client_id: data.client_id, token: _utils2.default.createToken(data.client_id, config) }) });
  });
}