'use strict';

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Config
var config = require('../config');

// Providers
var facebook = require('../providers/facebook');
var google = require('../providers/google');
var twitter = require('../providers/twitter');

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