var _ = require('lodash');
var jwt = require('jsonwebtoken');
var config = require('../config');


function redirectUrlBuilder(event) {
  return config.callback.replace('{provider}', event.provider);
}

function urlBuilder(url, params) {
  return url + '?' + urlParams(params);
}

function urlParams(params) {
  var p = _.map(params, function(value, key) {
     return key+'='+value
  });
  return p.join('&');
}

function createToken(client_id) {
  var token = jwt.sign({ client_id: client_id, expires: (new Date()).getTime()+(60*1000) }, config.secret);
  return token;
}

function readToken(token) {
  return jwt.verify(token, config.secret);
}

module.exports = {
  redirectUrlBuilder: redirectUrlBuilder,
  urlBuilder: urlBuilder,
  urlParams: urlParams,
  createToken: createToken,
  readToken: readToken
}