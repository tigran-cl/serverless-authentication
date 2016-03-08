'use strict';

export default class Profile {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.picture = data.picture;
  }
}