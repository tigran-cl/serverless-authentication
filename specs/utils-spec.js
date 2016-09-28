'use strict';

const utils = require('../lib').utils;
const config = require('../lib').config;
const crypto = require('crypto');
const expect = require('chai').expect;
const envVars = require('./envVars.json');

describe('Utils', () => {
  describe('Utils.redirectUrlBuilder', () => {
    it('should replace {provider} with facebook in url', () => {
      // Change to use config
      const testUrl = 'https://api.laardee.com/signin/{provider}';
      const builtUrl = utils.redirectUrlBuilder(testUrl, 'facebook');
      expect(builtUrl).to.equal('https://api.laardee.com/signin/facebook');
    });
  });

  describe('Utils.urlBuilder', () => {
    it('should add ?foo=bar to https://api.laardee.com/callback/facebook', () => {
      // Change to use config
      const builtUrl = utils.urlBuilder('https://api.laardee.com/callback/facebook', { foo: 'bar' });
      expect(builtUrl).to.equal('https://api.laardee.com/callback/facebook?foo=bar');
    });
  });

  describe('Utils.createToken', () => {
    it('should create new token', () => {
      const providerConfig = config('facebook', envVars);
      const token =
        utils.createToken({ foo: 'bar' }, providerConfig.tokenSecret, { expiresIn: 1 });
      expect(token).match(/[a-zA-Z0-9-_]+?.[a-zA-Z0-9-_]+?.([a-zA-Z0-9-_]+)[a-zA-Z0-9-_]+?$/g);
      expect(token.split('.')[0]).to.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9');
    });
  });

  describe('Utils.readToken', () => {
    it('should read token', () => {
      const tokenSecret = config({ provider: 'facebook' }, envVars).tokenSecret;
      const token = utils.createToken({ foo: 'bar' }, tokenSecret, { expiresIn: 60 });
      const data = utils.readToken(token, tokenSecret);
      expect(data.foo).to.equal('bar');
    });

    it('should fail to read expired token', () => {
      const tokenSecret = config({ provider: 'facebook' }, envVars).tokenSecret;
      const token = utils.createToken({ foo: 'bar' }, tokenSecret, { expiresIn: 0 });
      try {
        utils.readToken(token, tokenSecret);
      } catch (error) {
        expect(error.name).to.equal('TokenExpiredError');
        expect(error.message).to.equal('jwt expired');
      }
    });
  });

  describe('Utils.tokenResponse', () => {
    it('should return token response', () => {
      const providerConfig = config({ provider: 'facebook', stage: 'dev' }, envVars);
      const authorizationToken = {
        payload: {
          id: 'bar'
        },
        options: {
          expiresIn: 60
        }
      };
      utils.tokenResponse({ authorizationToken }, providerConfig, (err, data) => {
        expect(data.url).to.match(/http:\/\/localhost:3000\/auth\/facebook\/(\D)*[a-zA-Z0-9-_]+?.[a-zA-Z0-9-_]+?.([a-zA-Z0-9-_]+)[a-zA-Z0-9-_]+?$/);
      });
    });
  });

  describe('Utils.tokenResponse with refresh token', () => {
    it('should return token response with refresh token', () => {
      const providerConfig = config({ provider: 'facebook' }, envVars);
      const id = 'bar';
      const time = (new Date()).getTime();
      const hmac = crypto.createHmac('sha256', providerConfig.tokenSecret);
      hmac.update(`${id}-${time}`);
      const refreshToken = hmac.digest('hex');
      const authorizationToken = {
        payload: {
          id
        },
        options: {
          expiresIn: 15
        }
      };
      utils.tokenResponse({ authorizationToken, refreshToken, id }, providerConfig, (err, data) => {
        expect(data.url).to.match(/http:\/\/localhost:3000\/auth\/facebook\/\?authorization_token=[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?&refresh_token=[A-Fa-f0-9]{64}&id=.+$/);
      });
    });
  });

  describe('Utils.errorResponse', () => {
    it('should return error response', () => {
      const providerConfig = config({ provider: 'crappy-provider', stage: 'dev' }, envVars);
      const params = { error: 'Invalid provider' };
      utils.errorResponse(params, providerConfig, (err, data) => {
        expect(data.url).to.equal('http://localhost:3000/auth/crappy-provider/?error=Invalid provider');
      });
    });
  });

  describe('Utils.generatePolicy', () => {
    it('should generate policy', () => {
      const policy =
        utils.generatePolicy('eetu', 'Allow', 'arn:aws:execute-api:eu-west-1:nnn:nnn/*/GET/');
      expect(policy.principalId).to.equal('eetu');
    });
  });
});
