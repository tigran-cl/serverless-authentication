'use strict';

const Profile = require('../lib').Profile;
const _ = require('lodash');
const expect = require('chai').expect;

describe('Profile', () => {
  describe('create a new Profile', () => {
    it('should create a new profile from data', () => {
      const response = {
        address: {
          street_address: 'Urho Kekkosen Katu 7B',
          locality: 'Helsinki',
          region: 'Uusimaa',
          postal_code: '00100',
          country: 'Finland'
        },
        birthdate: '1970-01-01',
        email_verified: false,
        email: 'email@test.com',
        family_name: 'Tuomala',
        gender: 'male',
        given_name: 'Eetu',
        id: '12345',
        locale: 'fi-FI',
        middle_name: 'Laardee',
        name: 'Eetu Tuomala',
        nickname: 'Laardee',
        phone_number_verified: false,
        phone_number: '+1 (11) 111 1111',
        picture: 'https://avatars3.githubusercontent.com/u/4726921?v=3&s=460',
        preferred_username: 'Laardee',
        profile: 'https://fi.linkedin.com/in/eetutuomala',
        provider: 'facebook',
        sub: null,
        updated_at: null,
        website: 'https://github.com/laardee',
        zoneinfo: null,
        extra: 'extra'
      };

      const data = _.assign({}, response, { _raw: response });
      const profile = new Profile(data);

      expect(profile.id).to.equal('12345');
      expect(profile.name).to.equal('Eetu Tuomala');
      expect(profile.email).to.equal('email@test.com');
      expect(profile.picture).to.equal('https://avatars3.githubusercontent.com/u/4726921?v=3&s=460');
      expect(profile.provider).to.equal('facebook');
      expect(profile.address.formatted).to.equal('Urho Kekkosen Katu 7B\n00100 Helsinki\nFinland');
      expect(profile).not.to.have.property('extra');
      expect(profile._raw).to.have.property('extra');
    });
  });
});
