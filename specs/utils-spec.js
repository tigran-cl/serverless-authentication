"use strict";

let assert = require('assert');
let utils = require('../lib').utils;
let config = require('../lib').config;

describe('Utils', () => {
  describe('Utils.redirectUrlBuilder', () => {
    it('should replace {provider} with facebook in url', () => {
      //Change to use config
      let testUrl = 'https://api.laardee.com/signin/{provider}';
      let builtUrl = utils.redirectUrlBuilder(testUrl, 'facebook');
      expect(builtUrl).to.equal('https://api.laardee.com/signin/facebook');
    });
  });
  
  describe('Utils.urlBuilder', () => {
    it('should add ?foo=bar to https://api.laardee.com/callback/facebook', () => {
      //Change to use config
      var builtUrl = utils.urlBuilder('https://api.laardee.com/callback/facebook', {foo: 'bar'});
      expect(builtUrl).to.equal('https://api.laardee.com/callback/facebook?foo=bar');
    });
  });
  
  describe('Utils.createToken', () => {
    it('should create new token', () => {
      let providerConfig = config('facebook');
      var token = utils.createToken({foo: 'bar'}, providerConfig.token_secret, {expiresIn: 1});
      expect(token).match(/[a-zA-Z0-9-_]+?.[a-zA-Z0-9-_]+?.([a-zA-Z0-9-_]+)[a-zA-Z0-9-_]+?$/g);
      expect(token.split('.')[0]).to.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9');
    });
  });
  
  describe('Utils.readToken', () => {
    it('should read token', () => {
      let token_secret = config('facebook').token_secret;
      var token = utils.createToken({foo: 'bar'}, token_secret, {expiresIn: 60});
      var data = utils.readToken(token, token_secret);
      expect(data.foo).to.equal('bar');
    });

    it('should fail to read expired token', () => {
      let token_secret = config('facebook').token_secret;
      var token = utils.createToken({foo: 'bar'}, token_secret, {expiresIn: 0});
      try {
        utils.readToken(token, token_secret);
      }catch(error){
        expect(error.name).to.equal('TokenExpiredError');
        expect(error.message).to.equal('jwt expired');
      }
    });
  });
  
  describe('Utils.tokenResponse', () => {
    it('should return token response', () => {
      let providerConfig = config('facebook');
      let testdata = {
        payload: {
          id: 'bar'
        },
        options: {
          expiresIn: 60
        }
      };
      utils.tokenResponse(testdata, providerConfig, (err, data) => {
        expect(data.url).to.match(/http:\/\/localhost:3000\/auth\/facebook\/(\D)*[a-zA-Z0-9-_]+?.[a-zA-Z0-9-_]+?.([a-zA-Z0-9-_]+)[a-zA-Z0-9-_]+?$/);
      });
    });
  });
  
  describe('Utils.generatePolicy', () => {
    it('should generate policy', () => {
      let policy = utils.generatePolicy('eetu', 'Allow', 'arn:aws:execute-api:eu-west-1:nnn:nnn/*/GET/');
      expect(policy.principalId).to.equal('eetu');
    });
  });
});