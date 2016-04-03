'use strict';

let assert = require('assert');
let config = require('../lib').config;

describe('Config', () => {
  describe('create a new Config', () => {
    it('test facebook config', () => {
      let providerConfig = config({provider: 'facebook'});
      expect(providerConfig.id).to.equal('fb-mock-id');
      expect(providerConfig.secret).to.equal('fb-mock-secret');
      expect(providerConfig.redirect_uri).to.equal('https://api-id.execute-api.eu-west-1.amazonaws.com/dev/authentication/callback/facebook');
      expect(providerConfig.redirect_client_uri).to.equal('http://localhost:3000/auth/facebook/');
    });

    it('test facebook config with fallback string provider', () => {
      let providerConfig = config('facebook');
      expect(providerConfig.id).to.equal('fb-mock-id');
      expect(providerConfig.secret).to.equal('fb-mock-secret');
      expect(providerConfig.redirect_uri).to.equal('https://api-id.execute-api.eu-west-1.amazonaws.com/dev/authentication/callback/facebook');
      expect(providerConfig.redirect_client_uri).to.equal('http://localhost:3000/auth/facebook/');
    });

    it('test facebook config with out REDIRECT_URI env variable', () => {
      delete process.env.REDIRECT_URI;
      let providerConfig = config({provider: 'facebook', stage: 'prod', host: 'test-api-id.execute-api.eu-west-1.amazonaws.com'});
      expect(providerConfig.id).to.equal('fb-mock-id');
      expect(providerConfig.secret).to.equal('fb-mock-secret');
      expect(providerConfig.redirect_uri).to.equal('https://test-api-id.execute-api.eu-west-1.amazonaws.com/prod/authentication/callback/facebook');
      expect(providerConfig.redirect_client_uri).to.equal('http://localhost:3000/auth/facebook/');
    });

    it('test custom-config', () => {
      let providerConfig = config({provider: 'custom-config'});
      console.log(providerConfig);
      expect(providerConfig.id).to.equal('cc-mock-id');
      expect(providerConfig.secret).to.equal('cc-mock-secret');
      expect(providerConfig.redirect_uri).to.equal('https://test-api-id.execute-api.eu-west-1.amazonaws.com/prod/authentication/callback/custom-config');
      expect(providerConfig.redirect_client_uri).to.equal('http://localhost:3000/auth/custom-config/');
    });

    it('test custom_config', () => {
      let providerConfig = config({provider: 'custom_config'});
      console.log(providerConfig);
      expect(providerConfig.id).to.equal('cc-mock-id');
      expect(providerConfig.secret).to.equal('cc-mock-secret');
      expect(providerConfig.redirect_uri).to.equal('https://test-api-id.execute-api.eu-west-1.amazonaws.com/prod/authentication/callback/custom_config');
      expect(providerConfig.redirect_client_uri).to.equal('http://localhost:3000/auth/custom_config/');
    });
  });
});