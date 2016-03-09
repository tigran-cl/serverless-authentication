'use strict';

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Config
var config = require('../config');

var Utils = require('../lib/utils').default;

var generatePolicy = function(principalId, effect, resource) {
  var authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

module.exports.handler = function(event, context) {
  var error = false;
  try {
    var data = Utils.readToken(event.authorizationToken, config);
    var now = (new Date()).getTime();
    if(data.expires < now) {
      error = true; //Token expired;
    }
  } catch(err) {
    error = true; //Invalid token;
  }
  if (!error) {
    return context.succeed(generatePolicy(data.id, 'Allow', event.methodArn));
  } else {
    return context.fail('Unauthorized');
  }
};