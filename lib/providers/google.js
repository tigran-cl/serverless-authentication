'use strict';

var https = require('https');
var async = require('async');
var utils = require('../utils');

module.exports = {
  signin: function signin(event, config, callback) {
    var params = {
      client_id: config.google.id,
      redirect_uri: utils.redirectUrlBuilder(event, config),
      response_type: 'code',
      scope: 'profile'
    };
    var url = utils.urlBuilder('https://accounts.google.com/o/oauth2/v2/auth', params);
    callback(null, { url: url });
  },
  callback: function callback(event, config, _callback) {
    var params = {
      client_id: config.google.id,
      redirect_uri: utils.redirectUrlBuilder(event),
      client_secret: config.google.secret,
      code: event.code,
      grant_type: 'authorization_code'
    };
    async.waterfall([function (callback) {
      var options = {
        hostname: 'www.googleapis.com',
        port: 443,
        path: '/oauth2/v4/token?' + utils.urlParams(params),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };
      var req = https.request(options, function (res) {
        res.on('data', function (d) {
          var n = JSON.parse(d);
          callback(null, n);
        });
      });
      req.end();
      req.on('error', callback);
    }, function (data, callback) {
      https.get(utils.urlBuilder('https://www.googleapis.com/plus/v1/people/me', { fields: 'id', access_token: data.access_token }), function (res) {
        res.on('data', function (d) {
          var n = JSON.parse(d);
          var result = data;
          result.client_id = n.id;
          callback(null, result);
        });
      }).on('error', callback);
    }], function (err, data) {
      _callback(err, { url: utils.urlBuilder(config.redirect, { token: utils.createToken(data.client_id), client_id: data.client_id }) });
    });
  }
};