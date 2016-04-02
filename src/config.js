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
    result.provider = provider;
    return result;
  }
}

/**
 * @param provider {string} oauth provider name e.g. facebook or google 
 */
export function config(options){
  let provider;
  let host;
  let stage;
  // fallback -- remove on version upgrade
  if(typeof (options) === 'string'){
    provider = options;
  }else{
    provider = options.provider;
    host = options.host;
    stage = options.stage;
  }

  if (!process.env.REDIRECT_URI) {
    process.env.REDIRECT_URI = 'https://'+ host + '/' + stage + '/authentication/callback/{provider}';
  }

  let c = new Config();
  return c.getConfig(provider);
}