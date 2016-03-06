'use strict';

import Utils from '../utils';
import async from 'async';
import request from '../request';

// not yet working

export function signin(event, config, callback) {
  //let params = {
  //  consumerKey: config.twitter.id,
  //  consumerSecret: config.twitter.secret,
  //  redirect_uri: Utils.redirectUrlBuilder(event, config)
  //};
  //let url = Utils.urlBuilder('https://api.twitter.com/oauth/request_token', params);
  //callback(null, {url: url})
  callback('Not implemented');
}

export function callback(event, config, callback) {
  callback('Not implemented');
}