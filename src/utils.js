import jwt from 'jsonwebtoken';

export default class utils {
  static redirectUrlBuilder(event, config) {
    return config.callback.replace('{provider}', event.provider);
  }

  static urlBuilder(url, params) {
    return url + '?' + this.urlParams(params);
  }

  static urlParams(params) {
    let result = [];
    for(let key in params) {
      result.push(`${key}=${params[key]}`);
    }
    return result.join('&');
  }

  static createToken(data, config) {
    return jwt.sign(data, config.secret);
  }

  static readToken(token, config) {
    return jwt.verify(token, config.secret);
  }

  static tokenResponse(data, config, callback) {
    var url = this.urlBuilder(config.redirect, {
      id: data.id,
      token: this.createToken(data, config)
    });
    callback(null, {url: url});
  }
}