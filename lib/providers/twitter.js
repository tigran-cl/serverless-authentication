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

// not yet working

function signin(event, config, callback) {
  //let params = {
  //  consumerKey: config.twitter.id,
  //  consumerSecret: config.twitter.secret,
  //  redirect_uri: Utils.redirectUrlBuilder(event, config)
  //};
  //let url = Utils.urlBuilder('https://api.twitter.com/oauth/request_token', params);
  //callback(null, {url: url})
  callback('Not implemented');
}

function callback(event, config, callback) {
  callback('Not implemented');
}