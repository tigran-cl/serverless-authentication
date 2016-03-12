var _ = require('lodash');

providers = {
  facebook: {
    id: process.env.FACEBOOK_ID,
    secret: process.env.FACEBOOK_SECRET
  }
};

common = {
  secret: 'token-secret',
  redirect_uri: "https://i3tswjv8ak.execute-api.eu-west-1.amazonaws.com/dev/callback/{provider}",
  redirect_client_uri: "http://laardee.github.io/serverless-authentication-gh-pages/"
};

function getConfig(provider) {
	var config = _.assign(common, _.get(providers, provider));
  config.redirect_uri = config.redirect_uri.replace('{provider}', provider);
	return common;
}

exports = module.exports = {
   getConfig: getConfig
};