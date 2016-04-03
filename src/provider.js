import {Utils} from './utils';
import async from 'async';
import request from 'request';

export class Provider {
  constructor(config) {
    this.config = config;
  }

  signin({signin_uri, scope, state, response_type}, callback) {
    let {id, redirect_uri} = this.config;
    let params = {
      client_id: id,
      redirect_uri
    };
    if (response_type) {
      params.response_type = response_type;
    }
    if (scope) {
      params.scope = scope;
    }
    if (state) {
      params.state = state;
    }
    if (!params.client_id || !params.redirect_uri) {
      callback(`Invalid sign in params. ${params.client_id} ${params.redirect_uri}`);
    } else {
      let url = Utils.urlBuilder(signin_uri, params);
      callback(null, {url});
    }
  }

  callback({code, state}, {authorization_uri, profile_uri, profileMap}, additionalParams, callback) {
    let {id, redirect_uri, secret, provider} = this.config;
    async.waterfall([
      (callback) => {
        let mandatoryParams = {
          client_id: id,
          redirect_uri,
          client_secret: secret,
          code
        };
        let payload = Object.assign(mandatoryParams, additionalParams);
        request.post(authorization_uri, {form: payload}, callback);
      },
      (response, accessData, callback) => {
        if (!accessData) {
          callback('No access data');
        }
        let {access_token} = JSON.parse(accessData);
        let url = Utils.urlBuilder(profile_uri, {access_token});
        request.get(url, (error, response, profileData) => {
          if (error) {
            callback(error);
          } else if (!profileData) {
            callback('No profile data');
          } else {
            let profileJson = JSON.parse(profileData);
            profileJson.provider = provider;
            let mappedProfile = profileMap ? profileMap(profileJson) : profileJson;
            callback(null, mappedProfile);
          }
        });
      }
    ], (err, data) => {
      callback(err, data, state);
    });
  }
}