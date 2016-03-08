import jwt from 'jsonwebtoken';

export default class Utils {
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

  static createToken(id, config) {
    var token = jwt.sign({id, expires: (new Date()).getTime()+(60*1000)}, config.secret);
    return token;
  }

  static readToken(token, config) {
    return jwt.verify(token, config.secret);
  }

  static tokenResponse(context, id, config) {
    var url = this.urlBuilder(config.redirect, {
      id,
      token: this.createToken(id, config)
    });
    context.succeed({url: url});
  }
}