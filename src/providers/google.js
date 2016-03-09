'use strict';

import Utils from '../utils';
import async from 'async';
import request from 'request';
import Profile from '../profile';

export function signin(event, config, callback) {
  let params = {
    client_id: config.google.id,
    redirect_uri: Utils.redirectUrlBuilder(event, config),
    response_type: 'code',
    scope: 'profile email'
  };
  let url = Utils.urlBuilder('https://accounts.google.com/o/oauth2/v2/auth', params);
  callback(null, {url: url});
}

export function callback(event, config, callback) {
  async.waterfall([
    (callback) => {
      let options = {
        client_id: config.google.id,
        redirect_uri: Utils.redirectUrlBuilder(event, config),
        client_secret: config.google.secret,
        code: event.code,
        grant_type: 'authorization_code'
      };
      request.post('https://www.googleapis.com/oauth2/v4/token', {form: options}, callback);
    },
    (response, data, callback) => {
      let d = JSON.parse(data);
      let options = {
        url: Utils.urlBuilder('https://www.googleapis.com/plus/v1/people/me', {
          access_token: d.access_token
        })
      };
      request(options, (error, response, data) => {
        if(!error) {
          callback(null, responseToProfile(JSON.parse(data)));
        } else {
          callback(err);
        }
      });
    }
  ], (err, data) => {
    callback(err, data);
  });
}

function responseToProfile(response) {
  return new Profile({
    id: response.id,
    name: response.displayName,
    email: response.emails[0].value,
    picture: response.image.url,
    provider: 'google'
  });
}