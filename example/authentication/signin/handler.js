'use strict';

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Config
var configOld = require('../config');
var getConfig = require('../configEnv').getConfig;

var config = require('../lib/config');
console.log('c', config.getConfig('facebook'));

// Providers
var facebook = require('../lib/providers/facebook');
var google = require('../lib/providers/google');
var twitter = require('../lib/providers/twitter');
var microsoft = require('../lib/providers/microsoft');

module.exports.handler = function(event, context) {
  var configItem = config.getConfig(event.provider);
  
  if (event.provider === 'facebook') {
    facebook.signin(event, configItem, context.done);
  } else if (event.provider === 'google') {
    google.signin(event, configOld, context.done);
  } else if (event.provider === 'twitter') {
    twitter.signin(event, configOld, context.done);
  } else if (event.provider === 'microsoft') {
    microsoft.signin(event, configOld, context.done);
  } else {
    context.done('Invalid provider');
  }
};