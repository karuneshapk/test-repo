/* eslint-disable max-len */
const phoneContryCodes = [1,7,20,27,30,31,32,33,34,36,39,40,41,43,44,45,46,47,48,49,51,52,53,54,55,56,57,58,60,61,62,63,64,65,66,81,82,84,86,90,91,92,93,94,95,98,211,212,213,216,218,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,248,249,250,251,252,253,254,255,256,257,258,260,261,262,263,264,265,266,267,268,269,290,291,297,298,299,350,351,352,353,354,355,356,357,358,359,370,371,372,373,374,375,376,377,378,380,381,382,385,386,387,389,420,421,423,500,501,502,503,504,505,506,507,508,509,590,591,592,593,594,595,596,597,598,599,670,672,673,674,675,676,677,678,679,680,681,682,683,685,686,687,688,689,690,691,692,850,852,853,855,856,870,880,886,960,961,962,963,964,965,966,967,968,970,971,972,973,974,975,976,977,992,993,994,995,996,998]
/* eslint-enable max-len */

/**
 * Parses phone number
 *
 * Function expects phone number that comply E164 phone format.
 *
 * Return value is an object that has following fields:
 * - prefix - plus sign ('+')
 * - code - international phone code number
 * - number the rest of the phone number
 *
 * Note: if an input number is null, undefined, has no plus '+', has
 * incorrect country calling number then the return object will be
 * { prefix: '', code: '', number: raw input number}
 *
 * @example
 *
 * input: +420123456789
 * output: { prefix: '+', code: '+420', number: '123456789'}
 *
 * @param {string} value - phone number in E164 format
 *
 * @return {Object} parsed phone number
 */
export const parsePhoneNumber = value => {
  if (!value || !value.startsWith('+')) {
    return {
      prefix: '',
      code: '',
      number: '',
      number: value
    }
  }

  // here we are trying to retrieve the country calling code from the input number
  // in 1 to 3 attempts, firstly we try one digit country code, then we try first two
  // and eventually three.

  // note: country calling code list assembled so that country codes don't collide,
  // what means if there is country code with value '1' then the list won't contain
  // code that begins from '1' e.g. '12' or '145'
  let countryCode

  for (let i = 1; i <= 3; i++) {
    var code = value.substr(1, i)
    if (phoneContryCodes.indexOf(+code) !== -1) {
      countryCode = String(code)
      break
    }
  }

  if (countryCode) {
    return {
      prefix: '',
      code: '',
      number: '',
      prefix: '+',
      code: countryCode,
      number: value.substr(1 + code.length)
    }
  } else {
    return {
      prefix: '',
      code: '',
      number: '',
      prefix: '+',
      number: value.substr(1)
    }
  }
}

/**
 * Formats the phone number
 *
 * Input phone number should comply E164 phone format, what means:
 * - plus sign and a country code are mandatory;
 * - whitespaces or any separators like dashes and dots are not allowed.
 *
 * Return value is a phone number that has following format:
 * plus sign + country code + space + the rest is spilt by spaces in
 * the fragments of three numbers
 *
 * Note: if the input phone number is one of the following:
 *  - null
 *  - undefined
 *  - has no plus sign or has invalid country code
 * then the raw input value is returned back to the caller.
 *
 * @example
 * +420123456789 -> +420 123 456 789
 *
 * @param {string} value - phone number in E164 format
 *
 * @return {string} formatted phone number
 */
export const formatPhoneNumber = value => {
  if (!value || !value.startsWith('+')) {
    return value
  }

  var { prefix, code, number} = parsePhoneNumber(value)
  var numberSpaced = number.match(/\d{3}/ig).join(' ')

  return `${prefix}${code}${(code.length > 0 ? ' ' : '')}${numberSpaced}`
}
