"use strict";

let assert = require('assert');
let config = require('../lib').config;

describe('Config', () => {
  describe('create a new Config', () => {
    it('test facebook config', () => {
      let providerConfig = config.getConfig('facebook');
      expect(providerConfig.id).to.equal('fb-mock-id');
      expect(providerConfig.secret).to.equal('fb-mock-secret');
      expect(providerConfig.redirect_uri).to.equal('https://api-id.execute-api.eu-west-1.amazonaws.com/dev/callback/facebook');
      expect(providerConfig.redirect_client_uri).to.equal('http://localhost:3000/auth/facebook/');
    });
  });
});