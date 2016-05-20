'use strict';
/**
 * Profile class that normalizes profile data fetched from authentication provider
 */

function formatAddress(address) {
  const result = address;
  if (result) {
    result.formatted =
      `${result.street_address}\n${result.postal_code} ${result.locality}\n${result.country}`;
    return result;
  }
  return null;
}

export class Profile {
  /**
   * @param data {object}
   */
  constructor(data) {
    const fields = [
      '_raw',
      'address',
      'birthdate',
      'email_verified',
      'email',
      'family_name',
      'gender',
      'given_name',
      'id',
      'locale',
      'middle_name',
      'name',
      'nickname',
      'phone_number_verified',
      'phone_number',
      'picture',
      'preferred_username',
      'profile',
      'provider',
      'sub',
      'updated_at',
      'website',
      'zoneinfo'
    ];

    for (const field of fields) {
      const value = data[field];
      if (field === 'address') {
        this.address = formatAddress(data.address);
      } else {
        this[field] = value || null;
      }
    }
  }
}
