'use strict';

const config = require('../lib').config;
const expect = require('chai').expect;
const envVars = require('./envVars.json');

describe('Config', () => {
  describe('create a new Config', () => {
    it('tests facebook config', () => {
      const providerConfig = config({ provider: 'facebook' }, envVars);
      expect(providerConfig.id).to.equal('fb-mock-id');
      expect(providerConfig.secret).to.equal('fb-mock-secret');
      expect(providerConfig.redirectUri).to.equal('https://api-id.execute-api.eu-west-1.amazonaws.com/dev/authentication/callback/facebook');
      expect(providerConfig.redirectClientUri).to.equal('http://localhost:3000/auth/facebook/');
    });

    it('tests facebook config with fallback string provider', () => {
      const providerConfig = config('facebook', envVars);
      expect(providerConfig.id).to.equal('fb-mock-id');
      expect(providerConfig.secret).to.equal('fb-mock-secret');
      expect(providerConfig.redirectUri).to.equal('https://api-id.execute-api.eu-west-1.amazonaws.com/dev/authentication/callback/facebook');
      expect(providerConfig.redirectClientUri).to.equal('http://localhost:3000/auth/facebook/');
    });

    it('tests facebook config without REDIRECT_URI env variable', () => {
      const tempEnvVars = Object.assign({}, envVars);
      delete tempEnvVars.redirectUri;
      const providerConfig =
        config({
          provider: 'facebook',
          stage: 'prod',
          host: 'test-api-id.execute-api.eu-west-1.amazonaws.com'
        },
          tempEnvVars
        );
      expect(providerConfig.id).to.equal('fb-mock-id');
      expect(providerConfig.secret).to.equal('fb-mock-secret');
      expect(providerConfig.redirectUri).to.equal('https://test-api-id.execute-api.eu-west-1.amazonaws.com/prod/authentication/callback/facebook');
      expect(providerConfig.redirectClientUri).to.equal('http://localhost:3000/auth/facebook/');
    });

    it('tests custom-config', () => {
      const providerConfig = config({ provider: 'custom-config' }, envVars);
      expect(providerConfig.id).to.equal('cc-mock-id');
      expect(providerConfig.secret).to.equal('cc-mock-secret');
      expect(providerConfig.redirectUri).to.equal('https://api-id.execute-api.eu-west-1.amazonaws.com/dev/authentication/callback/custom-config');
      expect(providerConfig.redirectClientUri).to.equal('http://localhost:3000/auth/custom-config/');
    });

    it('tests custom_config', () => {
      const providerConfig = config({ provider: 'custom_config' }, envVars);
      expect(providerConfig.id).to.equal('cc-mock-id');
      expect(providerConfig.secret).to.equal('cc-mock-secret');
      expect(providerConfig.redirectUri).to.equal('https://api-id.execute-api.eu-west-1.amazonaws.com/dev/authentication/callback/custom_config');
      expect(providerConfig.redirectClientUri).to.equal('http://localhost:3000/auth/custom_config/');
    });

    it('tests empty config', () => {
      const providerConfig = config({}, envVars);
      expect(providerConfig.tokenSecret).to.equal('token-secret-123');
    });
  });
});
