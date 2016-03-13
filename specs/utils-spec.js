"use strict";

let assert = require('assert');
let slsAuth = require('../lib');
let utils = slsAuth.utils;
let config = require('../lib').config;

describe('Utils', () => {
  describe('Utils.redirectUrlBuilder', () => {
    it('should replace {provider} with facebook in url', () => {
      let testUrl = 'https://api.laardee.com/signin/{provider}';
      let builtUrl = utils.redirectUrlBuilder({provider: 'facebook'}, {callback: testUrl});
      expect(builtUrl).to.equal('https://api.laardee.com/signin/facebook');
    });
  });
  
  describe('Utils.urlBuilder', () => {
    it('should add ?foo=bar to https://api.laardee.com/callback/facebook', () => {
      var builtUrl = utils.urlBuilder('https://api.laardee.com/callback/facebook', {foo: 'bar'});
      expect(builtUrl).to.equal('https://api.laardee.com/callback/facebook?foo=bar');
    });
  });
  
  describe('Utils.createToken', () => {
    it('should create new token', () => {
      let providerConfig = config.getConfig('facebook');
      var token = utils.createToken({foo: 'bar'}, providerConfig);
      expect(token).match(/[a-zA-Z0-9-_]+?.[a-zA-Z0-9-_]+?.([a-zA-Z0-9-_]+)[a-zA-Z0-9-_]+?$/g);
      expect(token.split('.')[0]).to.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9');
    });
  });
  
  describe('Utils.readToken', () => {
    it('should read token', () => {
      let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE0NTc5MDYzMDB9.CG16zqG1NE3SKZPoXZk3Z78_ABLO1oPchrmo0qB8Wlo';
      let providerConfig = config.getConfig('facebook');
      var data = utils.readToken(token, providerConfig);
      expect(data.foo).to.equal('bar');
    });
  });
  
  describe('Utils.tokenResponse', () => {
    it('should return token response', () => {
      let providerConfig = config.getConfig('facebook');
      utils.tokenResponse({id: 'bar'}, providerConfig, (err, data) => {
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