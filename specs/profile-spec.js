"use strict";

let assert = require('assert');
let Profile = require('../lib').Profile;

describe('Profile', () => {
  describe('create a new Profile', () => {
    it('should create a new profile from data', () => {
      let profile = new Profile({
        id: '12345',
        name: 'Eetu Tuomala',
        email: 'eetu.tuomala@sc5.io',
        picture: 'eetu.jpg',
        provider: 'facebook',
        extra: 'extra'
      });
      expect(profile.id).to.equal('12345');
      expect(profile.name).to.equal('Eetu Tuomala');
      expect(profile.email).to.equal('eetu.tuomala@sc5.io');
      expect(profile.picture).to.equal('eetu.jpg');
      expect(profile.provider).to.equal('facebook');
      expect(profile).not.to.have.property('extra');
    });
  });
});