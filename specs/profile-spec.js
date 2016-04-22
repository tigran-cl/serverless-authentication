'use strict';

const Profile = require('../lib').Profile;
const _ = require('lodash');
const expect = require('chai').expect;

describe('Profile', () => {
  describe('create a new Profile', () => {
    it('should create a new profile from data', () => {
      const response = {
        id: '12345',
        name: 'Eetu Tuomala',
        email: 'eetu.tuomala@sc5.io',
        picture: 'eetu.jpg',
        provider: 'facebook',
        extra: 'extra'
      };

      const data = _.assign({}, response, { _raw: response });
      const profile = new Profile(data);

      expect(profile.id).to.equal('12345');
      expect(profile.name).to.equal('Eetu Tuomala');
      expect(profile.email).to.equal('eetu.tuomala@sc5.io');
      expect(profile.picture).to.equal('eetu.jpg');
      expect(profile.provider).to.equal('facebook');
      expect(profile).not.to.have.property('extra');
      expect(profile._raw).to.have.property('extra');
    });
  });
});
