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

// Authorization: OAuth oauth_consumer_key="w1yftPHsEZdBkIvG9bRlxqP2k", oauth_nonce="36adfee87bfe904f04824b03e9ab682d", oauth_signature="hkGUv7%2FMuhP9UBI%2FBv7fEkmgZ0g%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1457292040", oauth_token="210150720-NJgfdcmbU7s6t7lLdtzd37Ed3TJ902nkXcWRVQuu", oauth_version="1.0"

function signin(event, config, callback) {
  var params = {
    consumerKey: config.twitter.id,
    consumerSecret: config.twitter.secret,
    redirect_uri: _utils2.default.redirectUrlBuilder(event, config)
  };
  var url = _utils2.default.urlBuilder('https://api.twitter.com/oauth/request_token', params);
  callback(null, { url: url });
}

function callback(event, config, callback) {
  callback('Not implemented');
}

//module.exports = {
//  signin: function(event, config, callback) {
// var params = {
//   consumerKey: config.twitter.id,
//   consumerSecret: config.twitter.secret,
//   callbackURL: utils.redirectUrlBuilder(event)
// };
// var url = utils.urlBuilder('https://api.twitter.com/oauth/authenticate', params);
// callback(null, {url: url})
//  callback('Not implemented');
//},
//callback: function(event, config, callback) {
//  var params = {
//   consumerKey: config.twitter.id,
//   callbackURL: utils.redirectUrlBuilder(event),
//   consumerSecret: config.twitter.secret,
//   code: event.code
// }; 
// async.waterfall([
//   function(callback) {
//     var options = {
//       hostname: 'api.twitter.com',
//       port: 443,
//       path: '/oauth/access_token?'+utils.urlParams(params),
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'}
//     };
//     var req = https.request(options, function(res) {
//       res.on('data', function(d) {
//         var n = JSON.parse(d);
//         callback(null, n);
//       });
//     })
//     req.end();
//     req.on('error', callback);
//   },
//   function(data, callback) {
//     https.get(utils.urlBuilder('https://api.twitter.com/1.1/account/verify_credentials.json', {fields: 'id', access_token: data.access_token}), function(res) {
//       res.on('data', function(d) {
//         var n = JSON.parse(d);
//         var result = data;
//         result.client_id = n.id;
//         callback(null, result);
//       });
//     }).on('error', callback);
//   }
// ], function (err, data) {
//   callback(err, {url: utils.urlBuilder(config.redirect, {token: utils.createToken(data.client_id), client_id: data.client_id})});
// });
//    callback('Not implemented');
//  }
//};