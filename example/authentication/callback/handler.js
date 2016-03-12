'use strict';

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Authentication logic
var authLib = require('../auth-library');

module.exports.handler = function(event, context) {
  return authLib.callback(event, context.done);
};