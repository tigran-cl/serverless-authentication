'use strict';

import Utils from '../utils';
import async from 'async';
import request from 'request';
import Profile from '../profile';

export function signin(event, config, callback) {
  let params = {
    client_id: config.facebook.id,
    redirect_uri: Utils.redirectUrlBuilder(event, config),
    scope: 'email'
  };
  let url = Utils.urlBuilder('https://www.facebook.com/dialog/oauth', params);
  callback(null, {url: url});
}

export function callback(event, config, callback) {
  async.waterfall([
    (callback) => {
      let url = Utils.urlBuilder('https://graph.facebook.com/v2.3/oauth/access_token', {
        client_id: config.facebook.id,
        redirect_uri: Utils.redirectUrlBuilder(event, config),
        client_secret: config.facebook.secret,
        code: event.code
      });
      request.get(url, callback);
    },
    (response, data, callback) => {
      let d = JSON.parse(data);
      let url = Utils.urlBuilder('https://graph.facebook.com/me', {
        fields: 'id,name,picture,email',
        access_token: d.access_token
      });
      request.get(url, (error, response, data) => {
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
    name: response.name,
    email: response.email,
    picture: !response.picture.data.is_silhouette ? response.picture.data.url : null,
    provider: 'facebook'
  });
}