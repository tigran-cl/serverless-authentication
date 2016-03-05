'use strict';

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Config
var config = require('../config');

// Providers
var facebook = require('../lib/providers/facebook');
var google = require('../lib/providers/google');
var twitter = require('../lib/providers/twitter');

module.exports.handler = function(event, context) {
  if (event.provider === 'facebook') {
    facebook.signin(event, config, context.done);
  } else if (event.provider === 'google') {
    google.signin(event, config, context.done);
  } else if (event.provider === 'twitter') {
    twitter.signin(event, config, context.done);
  } else {
    context.done('Invalid provider');
  }
};