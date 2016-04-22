import { Utils } from './utils';
import async from 'async';
import request from 'request';

/**
 * Default provider
 */
export class Provider {
  constructor(config) {
    this.config = config;
  }

  signin({ signin_uri, scope, state, response_type }, callback) {
    const { id, redirect_uri } = this.config;
    const params = {
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
      const url = Utils.urlBuilder(signin_uri, params);
      callback(null, { url });
    }
  }

  callback({ code, state },
    { authorization_uri,
      profile_uri,
      profileMap,
      authorizationMethod },
    additionalParams, cb) {
    const { authorization, profile } = additionalParams;
    const { id, redirect_uri, secret, provider } = this.config;
    async.waterfall([
      (callback) => {
        const mandatoryParams = {
          client_id: id,
          redirect_uri,
          client_secret: secret,
          code
        };
        const payload = Object.assign(mandatoryParams, authorization);
        if (authorizationMethod === 'GET') {
          const url = Utils.urlBuilder(authorization_uri, payload);
          request.get(url, callback);
        } else {
          request.post(authorization_uri, { form: payload }, callback);
        }
      },
      (response, accessData, callback) => {
        if (!accessData) {
          callback('No access data');
        }
        const { access_token } = JSON.parse(accessData);
        const url = Utils.urlBuilder(profile_uri, Object.assign({ access_token }, profile));
        request.get(url, (error, httpResponse, profileData) => {
          if (error) {
            callback(error);
          } else if (!profileData) {
            callback('No profile data');
          } else {
            const profileJson = JSON.parse(profileData);
            profileJson.provider = provider;
            const mappedProfile = profileMap ? profileMap(profileJson) : profileJson;
            callback(null, mappedProfile);
          }
        });
      }
    ], (err, data) => {
      cb(err, data, state);
    });
  }
}
