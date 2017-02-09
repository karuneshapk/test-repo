/**
 * Find an address component based upon the specified types
 *
 * @param {Object} addressComponents - the address components
 * @param {Array<string>} types - the address types
 *
 * @return {Object}
 */
function findAddressComponent(addressComponents, types) {
  var addressComponent = addressComponents
    .find(address => address.types.some(type => types.includes(type)))

  return {
    shortName: addressComponent ? addressComponent.short_name : '',
    longName: addressComponent ? addressComponent.long_name : ''
  }
}

/**
 * Address types
 * @type {{ADDRESS_TYPE1: string, ADDRESS_TYPE2: string}}
 */
var addressTypes = {
  ADDRESS_TYPE1: 'locality',
  ADDRESS_TYPE2: 'administrative_area_level_2'
}

/**
 * Postal code
 * @type {POSTAL_CODE: string}
 */
const POSTAL_CODE = 'postal_code'

/**
 * Country code
 * @type {COUNTRY_CODE: string}
 */
const COUNTRY_CODE = 'country'

/**
 * Country code
 * @type {COUNTRY_CODE: string}
 */
const ROUTE = 'route'

/**
 * Country code
 * @type {COUNTRY_CODE: string}
 */
const STREET_NUMBER = 'street_number'

/**
 * Get city from a complete address
 *
 * @param {Object} address - a full address component a city has to be searched in
 *
 * @return {string}
 */
export const getCity = address => findAddressComponent(
  address.address_components, [ addressTypes.ADDRESS_TYPE1, addressTypes.ADDRESS_TYPE2 ])

/**
 * Get address line 1 from a complete address
 *
 * @param {Object} address - a full address component a city has to be searched in
 *
 * @return {string}
 */
export const getLine1 = address => {
  const route = findAddressComponent(address.address_components, [ ROUTE ]).longName
  return route
    ? (`${route} ${findAddressComponent(address.address_components, [STREET_NUMBER]).longName}`).trim()
    : ''
}
/**
   * Get postal code a complete address
   *
   * @param {Object} address - a full address component a postal code has to be searched in
   *
   * @return {string}
   */
export const getPostalCode = address => findAddressComponent(
  address.address_components, [ POSTAL_CODE ])

/**
 * Get country from a complete address
 *
 * @param {Object} address - a full address component a country has to be searched in
 *
 * @return {string}
 */
export const getCountry = address => findAddressComponent(
  address.address_components, [ COUNTRY_CODE ])
