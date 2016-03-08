'use strict';

import Utils from '../utils';
import async from 'async';
import request from '../request';
import Profile from '../profile';

export function signin(event, config, callback) {
  let params = {
    client_id: config.microsoft.id,
    redirect_uri: Utils.redirectUrlBuilder(event, config),
    scope: 'wl.basic wl.emails',
    response_type: 'code'
  };
  let url = Utils.urlBuilder('https://login.live.com/oauth20_authorize.srf', params);
  callback(null, {url: url});
}

export function callback(event, config, callback) {
  async.waterfall([
    (callback) => {
      let params = {
        client_id: config.microsoft.id,
        redirect_uri: Utils.redirectUrlBuilder(event, config),
        client_secret: config.microsoft.secret,
        code: event.code,
        grant_type: 'authorization_code'
      };
      request({url: 'https://login.live.com/oauth20_token.srf', params, method: 'POST'}, callback);
    },
    (data, callback) => {
      let params = {
        access_token: data.access_token
      };
      request({url: 'https://apis.live.net/v5.0/me', params}, (err, response) => {
        if(!err) {
          callback(null, responseToProfile(response));
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
    name: response.name,
    email: response.emails.preferred,
    picture: 'https://apis.live.net/v5.0/'+response.id+'/picture',
    provider: 'microsoft'
  });
}