import {Utils} from './utils'; 
/**
 * Config class
 */
class Config {
  constructor(){
    let data = process.env;
    this.providers = {};
    for(let key in data) {
      let value = data[key];
      let providerItem = (/PROVIDER_(.*)?_(.*)?/g).exec(key);
      if(providerItem) {
        var provider = providerItem[1].toLowerCase();
        var type = providerItem[2].toLowerCase();
        if(!this.providers[provider]) {
          this.providers[provider] = {};
        }
        this.providers[provider][type] = value;
      } else if (key === 'REDIRECT_URI') {
        this.redirect_uri = value;
      } else if (key === 'REDIRECT_CLIENT_URI') {
        this.redirect_client_uri = value;
      } else if (key === 'TOKEN_SECRET') {
        this.token_secret = value;
      }
    }
  }
  
  getConfig(provider) {
    let result = this.providers[provider]?this.providers[provider]:{};
    result.redirect_uri = Utils.redirectUrlBuilder(this.redirect_uri, provider);
    result.redirect_client_uri = Utils.redirectUrlBuilder(this.redirect_client_uri, provider);
    result.token_secret = this.token_secret;
    return result;
  }
}

/**
 * @param provider {string} oauth provider name e.g. facebook or google 
 */
export function config(provider){
  let c = new Config();
  return c.getConfig(provider);
}