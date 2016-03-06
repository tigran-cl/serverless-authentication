'use strict';

import Utils from '../utils';
import async from 'async';
import request from '../request';

export function signin(event, config, callback) {
  let params = {
    client_id: config.google.id,
    redirect_uri: Utils.redirectUrlBuilder(event, config),
    response_type: 'code',
    scope: 'profile'
  };
  let url = Utils.urlBuilder('https://accounts.google.com/o/oauth2/v2/auth', params);
  callback(null, {url: url})
}

export function callback(event, config, callback) {
  let params = {
    client_id: config.google.id,
    redirect_uri: Utils.redirectUrlBuilder(event, config),
    client_secret: config.google.secret,
    code: event.code,
    grant_type: 'authorization_code'
  };
  async.waterfall([
    (callback) => {
      request({url: 'https://www.googleapis.com/oauth2/v4/token', params, method: 'POST'}, callback);
    },
    (data, callback) => {
      let p = {
        url: 'https://www.googleapis.com/plus/v1/people/me',
        params: {
          fields: 'id',
          access_token: data.access_token
        }
      };
      request(p, (err, res) => {
        let result = data;
        result.client_id = res.id;
        callback(null, result);
      });
    }
  ], (err, data) => {
    callback(err, {
      url: Utils.urlBuilder(config.redirect, {
        client_id: data.client_id,
        token: Utils.createToken(data.client_id, config)
      })
    });
  });
};