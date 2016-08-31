'use strict';

import { Utils } from './utils';

/**
 * Config class
 */
class Config {
  constructor(envVars) {
    this.providers = {};
    for (const key in envVars) {
      if (envVars.hasOwnProperty(key)) {
        const value = envVars[key];
        const providerItem = (/PROVIDER_(.*)?_(.*)?/g).exec(key);
        if (providerItem) {
          const provider = providerItem[1].toLowerCase();
          const type = providerItem[2].toLowerCase();
          if (!this.providers[provider]) {
            this.providers[provider] = {};
          }
          this.providers[provider][type] = value;
        } else if (key.toUpperCase() === 'REDIRECT_URI') {
          this.redirect_uri = value;
        } else if (key.toUpperCase() === 'REDIRECT_CLIENT_URI') {
          this.redirect_client_uri = value;
        } else if (key.toUpperCase() === 'TOKEN_SECRET') {
          this.token_secret = value;
        }
      }
    }
  }

  getConfig(provider) {
    let result = {};
    if (provider) {
      const configProvider = provider.replace(/-/g, '_');
      result = this.providers[configProvider] ? this.providers[configProvider] : {};
      result.redirect_uri = Utils.redirectUrlBuilder(this.redirect_uri, provider);
      result.redirect_client_uri = Utils.redirectUrlBuilder(this.redirect_client_uri, provider);
      result.provider = provider;
    }
    result.token_secret = this.token_secret;
    return result;
  }
}

/**
 * @param provider {string} oauth provider name e.g. facebook or google
 */
export function config(options, envVars) {
  let provider;
  let host;
  let stage;
  // fallback -- remove on version upgrade
  if (typeof (options) === 'string') {
    provider = options;
  } else {
    provider = options.provider;
    host = options.host;
    stage = options.stage;
  }

  if (!envVars.REDIRECT_URI) {
    envVars.REDIRECT_URI = `https://${host}/${stage}/authentication/callback/{provider}`;
  }

  return (new Config(envVars)).getConfig(provider);
}
