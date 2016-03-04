'use strict';

var https = require('https');
var async = require('async');
var utils = require('../lib/utils');

// not yet working

module.exports = {
  signin: function(event, config, callback) {
    // var params = {
    //   consumerKey: config.twitter.id,
    //   consumerSecret: config.twitter.secret,
    //   callbackURL: utils.redirectUrlBuilder(event)
    // };
    // var url = utils.urlBuilder('https://api.twitter.com/oauth/authenticate', params);
    // callback(null, {url: url})
    callback('Not implemented');
  },
  callback: function(event, config, callback) {
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
    callback('Not implemented');
  }
};