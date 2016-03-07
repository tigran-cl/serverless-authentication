'use strict';

export default class Profile {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.displayName = data.displayName;
    this.profileImageUrl = data.ProfileImageUrl;
  }
}