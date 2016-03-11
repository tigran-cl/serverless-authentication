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

module.exports.handler = function(event, context) {
  var c = getConfig(event.provider);
  
  if (event.provider === 'facebook') {
    facebook.signin(event, c, context.done);
  } else if (event.provider === 'google') {
    google.signin(event, config, context.done);
  } else if (event.provider === 'twitter') {
    twitter.signin(event, config, context.done);
  } else if (event.provider === 'microsoft') {
    microsoft.signin(event, config, context.done);
  } else {
    context.done('Invalid provider');
  }
};