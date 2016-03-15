'use strict';
/**
 * Profile class that normalizes profile data fetched from authentication provider
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Profile =
/**
 * @param data {object}
 */
exports.Profile = function Profile(data) {
  _classCallCheck(this, Profile);

  this.id = data.id;
  this.name = data.name;
  this.email = data.email;
  this.picture = data.picture;
  this.provider = data.provider;
  this._raw = data._raw;
};