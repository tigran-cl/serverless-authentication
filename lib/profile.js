'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Profile = function Profile(data) {
  _classCallCheck(this, Profile);

  this.id = data.id;
  this.username = data.username;
  this.displayName = data.displayName;
  this.profileImageUrl = data.ProfileImageUrl;
};

exports.default = Profile;