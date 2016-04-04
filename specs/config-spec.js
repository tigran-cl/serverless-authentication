'use strict';

let assert = require('assert');
let config = require('../lib').config;

describe('Config', () => {
  describe('create a new Config', () => {
    it('tests facebook config', () => {
      let providerConfig = config({provider: 'facebook'});
      expect(providerConfig.id).to.equal('fb-mock-id');
      expect(providerConfig.secret).to.equal('fb-mock-secret');
      expect(providerConfig.redirect_uri).to.equal('https://api-id.execute-api.eu-west-1.amazonaws.com/dev/authentication/callback/facebook');
      expect(providerConfig.redirect_client_uri).to.equal('http://localhost:3000/auth/facebook/');
    });

    it('tests facebook config with fallback string provider', () => {
      let providerConfig = config('facebook');
      expect(providerConfig.id).to.equal('fb-mock-id');
      expect(providerConfig.secret).to.equal('fb-mock-secret');
      expect(providerConfig.redirect_uri).to.equal('https://api-id.execute-api.eu-west-1.amazonaws.com/dev/authentication/callback/facebook');
      expect(providerConfig.redirect_client_uri).to.equal('http://localhost:3000/auth/facebook/');
    });

    it('tests facebook config with out REDIRECT_URI env variable', () => {
      delete process.env.REDIRECT_URI;
      let providerConfig = config({provider: 'facebook', stage: 'prod', host: 'test-api-id.execute-api.eu-west-1.amazonaws.com'});
      expect(providerConfig.id).to.equal('fb-mock-id');
      expect(providerConfig.secret).to.equal('fb-mock-secret');
      expect(providerConfig.redirect_uri).to.equal('https://test-api-id.execute-api.eu-west-1.amazonaws.com/prod/authentication/callback/facebook');
      expect(providerConfig.redirect_client_uri).to.equal('http://localhost:3000/auth/facebook/');
    });

    it('tests custom-config', () => {
      let providerConfig = config({provider: 'custom-config'});
      expect(providerConfig.id).to.equal('cc-mock-id');
      expect(providerConfig.secret).to.equal('cc-mock-secret');
      expect(providerConfig.redirect_uri).to.equal('https://test-api-id.execute-api.eu-west-1.amazonaws.com/prod/authentication/callback/custom-config');
      expect(providerConfig.redirect_client_uri).to.equal('http://localhost:3000/auth/custom-config/');
    });

    it('tests custom_config', () => {
      let providerConfig = config({provider: 'custom_config'});
      expect(providerConfig.id).to.equal('cc-mock-id');
      expect(providerConfig.secret).to.equal('cc-mock-secret');
      expect(providerConfig.redirect_uri).to.equal('https://test-api-id.execute-api.eu-west-1.amazonaws.com/prod/authentication/callback/custom_config');
      expect(providerConfig.redirect_client_uri).to.equal('http://localhost:3000/auth/custom_config/');
    });

    it('tests empty config', () => {
      let providerConfig = config({});
      expect(providerConfig.token_secret).to.equal('token-secret-123');
    });
  });
});