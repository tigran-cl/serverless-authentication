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
        const providerItem = (/provider(.*)?(Id|Secret)/g).exec(key);
        if (providerItem) {
          const providerName = providerItem[1].toLowerCase();
          const type = providerItem[2].toLowerCase();
          if (!this.providers[providerName]) {
            this.providers[providerName] = {};
          }
          this.providers[providerName][type] = value;
        } else {
          this[key] = value;
        }
      }
    }
  }

  getConfig(provider) {
    let result = {};
    if (provider) {
      const configProvider = provider.replace(/_/g, '-');
      result = this.providers[configProvider] ? this.providers[configProvider] : {};
      result.redirectUri = Utils.redirectUrlBuilder(this.redirectUri, provider);
      result.redirectClientUri = Utils.redirectUrlBuilder(this.redirectClientUri, provider);
      result.provider = provider;
    }
    result.tokenSecret = this.tokenSecret;
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

  if (!envVars.redirectUri) {
    envVars.redirectUri = `https://${host}/${stage}/authentication/callback/{provider}`;
  }

  return (new Config(envVars)).getConfig(provider);
}
