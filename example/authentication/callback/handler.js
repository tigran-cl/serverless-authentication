'use strict';

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Config
var config = require('../config');
var getConfig = require('../configEnv').getConfig;

// Providers
var facebook = require('../lib/providers/facebook');
var google = require('../lib/providers/google');
var twitter = require('../lib/providers/twitter');
var microsoft = require('../lib/providers/microsoft');

var Utils = require('../lib/utils').default;

module.exports.handler = function(event, context) {
  var c = getConfig(event.provider);
  if (event.provider === 'facebook') {
    facebook.callback(event, c, handleResponse);
  } else if (event.provider === 'google'){
    google.callback(event, config, handleResponse);
  } else if (event.provider === 'twitter') {
    twitter.callback(event, config, context.done);
  } else if (event.provider === 'microsoft') {
    microsoft.callback(event, config, handleResponse);
  } else {
    context.done('Invalid provider');
  }

  function handleResponse(err, profile) {
    if(err){
      context.fail(err);
    }else {
      var testing = false;
      var id = profile.provider + '-' +profile.id;
      var expires = (new Date()).getTime()+(60*1000);
      // check if user exist in db if not create new then return token
      if(testing) {
        context.done(null, profile);
      } else {
        Utils.tokenResponse({id: id, expires: expires}, config, context.done);
      }
    }
  }
};