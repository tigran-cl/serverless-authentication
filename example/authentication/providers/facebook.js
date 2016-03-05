'use strict';

var https = require('https');
var async = require('async');
var utils = require('../lib/utils');

module.exports = {
  signin: function(event, config, callback) {
    var params = {
      client_id: config.facebook.id,
      redirect_uri: utils.redirectUrlBuilder(event)
    };
    var url = utils.urlBuilder('https://www.facebook.com/dialog/oauth', params);
    callback(null, {url: url})
  },
  callback: function(event, config, callback) {
     var params = {
      client_id: config.facebook.id,
      redirect_uri: utils.redirectUrlBuilder(event),
      client_secret: config.facebook.secret,
      code: event.code
    };
    var url = utils.urlBuilder('https://graph.facebook.com/v2.3/oauth/access_token', params);
    async.waterfall([
      function(callback) {
        https.get(url, function(res) {
          res.on('data', function(d) {
            var n = JSON.parse(d);
            callback(null, n);
          });
        }).on('error', callback);
      },
      function(data, callback) {
        https.get(utils.urlBuilder('https://graph.facebook.com/me', {fields: 'id', access_token: data.access_token}), function(res) {
          res.on('data', function(d) {
            var n = JSON.parse(d);
            var result = data;
            result.client_id = n.id;
            callback(null, result);
          });
        }).on('error', callback);
      }
    ], function (err, data) {
      callback(err, {url: utils.urlBuilder(config.redirect, {token: utils.createToken(data.client_id)})});
    });
  }
};