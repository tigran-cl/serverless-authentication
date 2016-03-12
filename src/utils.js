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
    return jwt.sign(data, config.token_secret);
  }

  static readToken(token, config) {
    return jwt.verify(token, config.token_secret);
  }

  static tokenResponse(data, config, callback) {
    var url = this.urlBuilder(config.redirect_client_uri, {
      id: data.id,
      token: this.createToken(data, config)
    });
    callback(null, {url: url});
  }
  
  static generatePolicy(principalId, effect, resource) {
    let authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
      let policyDocument = {};
      policyDocument.Version = '2012-10-17';
      policyDocument.Statement = [];
      
      let statementOne = {};
      statementOne.Action = 'execute-api:Invoke';
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
    }
    return authResponse;
  }
}