class Config {
  constructor(){
    let data = process.env;
    this.providers = {};
    for(let key in data) {
      let providerItem = (/PROVIDER_(.*)?_(.*)?/g).exec(key);
      if(providerItem) {
        var provider = providerItem[1].toLowerCase();
        var type = providerItem[2].toLowerCase();
        if(!this.providers[provider]) {
          this.providers[provider] = {};
        }
        this.providers[provider][type] = data[key];
      }
    }
  }
  
  getConfig(provider) {
    let result = this.providers[provider];
    if(!result){
      throw new Error(`No provider ${provider} defined`);
    }
    return result;
  }
}

export function getConfig(provider){
  let c = new Config();
  return c.getConfig(provider);
}