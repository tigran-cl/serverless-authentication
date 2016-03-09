"use strict";

let assert = require('assert');
let Profile = require('../lib/profile').default;

describe('Profile', () => {
  describe('create a new Profile', () => {
    it('should create a new profile from data', (done) => {
      let profile = new Profile({
        id: '12345',
        name: 'Eetu Tuomala',
        email: 'eetu.tuomala@sc5.io',
        picture: 'eetu.jpg',
        provider: 'twitter',
        extra: 'extra'
      });
      let error = profile.extra ? new Error('No additional fields should exist') : null;
      done(error);
    });
  });
});