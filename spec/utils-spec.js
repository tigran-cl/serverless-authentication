"use strict";

let assert = require('assert');
let slsAuth = require('../lib');

describe('Utils', () => {
  describe('Utils.redirectUrlBuilder', () => {
    it('should replace {provider} with facebook in url', (done) => {
      let testUrl = 'https://api.laardee.com/signin/{provider}';
      let resultUrl = 'https://api.laardee.com/signin/facebook';
      let builtUrl = slsAuth.utils.redirectUrlBuilder({provider: 'facebook'}, {callback: testUrl});
      let err = resultUrl !== builtUrl?new Error(resultUrl + ' != ' +builtUrl):null;
      done(err);
    });
  });
  
  describe('Utils.urlBuilder', () => {
    it('should add ?foo=bar to https://api.laardee.com/callback/facebook', (done) => {
      let resultUrl = 'https://api.laardee.com/callback/facebook?foo=bar';
      var builtUrl = slsAuth.utils.urlBuilder('https://api.laardee.com/callback/facebook', {foo: 'bar'});
      let err = resultUrl !== builtUrl ? new Error(resultUrl + ' != ' +builtUrl) : null;
      done(err);
    });
  });
});