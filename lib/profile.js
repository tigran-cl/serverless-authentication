'use strict';

/**
 * Profile class that normalizes profile data fetched from authentication provider
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function formatAddress(address) {
  var result = address;
  if (result) {
    result.formatted = result.street_address + '\n' + result.postal_code + ' ' + result.locality + '\n' + result.country;
    return result;
  }
  return null;
}

var Profile =
/**
 * @param data {object}
 */
function Profile(data) {
  var _this = this;

  _classCallCheck(this, Profile);

  var fields = ['_raw', 'address', 'at_hash', 'birthdate', 'email_verified', 'email', 'family_name', 'gender', 'given_name', 'id', 'locale', 'middle_name', 'name', 'nickname', 'phone_number_verified', 'phone_number', 'picture', 'preferred_username', 'profile', 'provider', 'sub', 'updated_at', 'website', 'zoneinfo'];
  this._raw = data; // eslint-disable-line no-underscore-dangle
  fields.forEach(function (field) {
    if (Object.hasOwnProperty.call(data, field)) {
      var value = data[field];
      if (field === 'address') {
        _this.address = formatAddress(data.address);
      } else {
        _this[field] = value || null;
      }
    }
  });
};

module.exports = {
  Profile: Profile
};