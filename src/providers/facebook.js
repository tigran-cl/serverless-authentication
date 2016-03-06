'use strict';

import Utils from '../utils';
import async from 'async';
import request from '../request';

export function signin(event, config, callback) {
  let params = {
    client_id: config.facebook.id,
    redirect_uri: Utils.redirectUrlBuilder(event, config)
  };
  let url = Utils.urlBuilder('https://www.facebook.com/dialog/oauth', params);
  callback(null, {url: url})
}

export function callback(event, config, callback) {
  let params = {
    client_id: config.facebook.id,
    redirect_uri: Utils.redirectUrlBuilder(event, config),
    client_secret: config.facebook.secret,
    code: event.code
  };
  async.waterfall([
    (callback) => {
      request({url: 'https://graph.facebook.com/v2.3/oauth/access_token', params}, callback);
    },
    (data, callback) => {
      let p = {
        url: 'https://graph.facebook.com/me',
        params: {
          fields: 'id',
          access_token: data.access_token
        }
      };
      request(p, (err, res) => {
        var result = data;
        result.client_id = res.id;
        callback(null, result);
      });
    }
  ], (err, data) => {
    callback(err, {url: Utils.urlBuilder(config.redirect, {client_id:data.client_id, token: Utils.createToken(data.client_id, config)})});
  });
}