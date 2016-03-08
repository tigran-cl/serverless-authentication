'use strict';

import Utils from '../utils';
import async from 'async';
import request from '../request';
import Profile from '../profile';

export function signin(event, config, callback) {
  let params = {
    client_id: config.facebook.id,
    redirect_uri: Utils.redirectUrlBuilder(event, config),
    scope: 'email'
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
          fields: 'id,name,picture,email',
          access_token: data.access_token
        }
      };
      request(p, (err, response) => {
        var result = data;
        result.client_id = response.id;

        var profile = responseToProfile(response);

        callback(null, profile);
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
    email: response.email,
    picture: !response.picture.data.is_silhouette ? response.picture.data.url : null
  });
}