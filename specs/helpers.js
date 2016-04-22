'use strict';

const chai = require('chai');
const dirtyChai = require('dirty-chai');
chai.use(dirtyChai);


process.env.PROVIDER_FACEBOOK_ID = 'fb-mock-id';
process.env.PROVIDER_FACEBOOK_SECRET = 'fb-mock-secret';

process.env.PROVIDER_CUSTOM_CONFIG_ID = 'cc-mock-id';
process.env.PROVIDER_CUSTOM_CONFIG_SECRET = 'cc-mock-secret';

process.env.REDIRECT_CLIENT_URI = 'http://localhost:3000/auth/{provider}/';
process.env.REDIRECT_URI = 'https://api-id.execute-api.eu-west-1.amazonaws.com/dev/authentication/callback/{provider}';
process.env.TOKEN_SECRET = 'token-secret-123';

chai.config.includeStack = true;

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
