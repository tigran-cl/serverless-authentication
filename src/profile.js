'use strict';
/**
 * Profile class that normalizes profile data fetched from authentication provider
 */
export class Profile {
  /**
   * @param data {object}
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.picture = data.picture;
    this.provider = data.provider;
    this._raw = data._raw;
  }
}