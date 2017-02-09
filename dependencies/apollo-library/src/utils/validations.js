import moment from 'moment'

import {
  MIN_BIRTH_DATE,
  DATE_FORMAT,
  DATE_COMPONENT_FORMAT,
  LONG_STRING_MIN,
  LONG_STRING_MAX,
  EMAIL_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
} from 'apollo-library/constants/general'

import { isEmptyString, trim, now } from './common'

/**
 * Required field, not undefined, null or empty string
 *
 * @param {*} value - value to be checked
 *
 * @return {boolean}
 */
const required = (value) => {
  return !!value && (
    (
      (
        typeof value === 'string' ||
        (typeof value === 'number' && !isNaN(value))
      ) && !isEmptyString(trim(value))) ||
      (Array.isArray(value) && value.length > 0) ||
      (value instanceof File) ||
      (typeof value === 'object' && Object.keys(value).length > 0 && Object.keys(value).every((key) => required(value[key])))
    )
}

/**
 * Validate if provide value is number
 * (even if its type is 'string')
 *
 * @param {*} value to validate
 *
 * @return {boolean}
 */
const isNumber = (value) => {
  return (typeof value === 'number' || typeof value === 'string') && isFinite(value)
}

/**
 * Validate if all properties in object are numbers
 *
 * @param {Object} value to validate
 *
 * @return {boolean}
 */
const isNumberObject = (value) => {
  return (typeof value === 'object' &&
    Object.keys(value).length > 0 &&
    Object.keys(value).every((key) => isNumber(value[key])))
}

/**
 * Validates provided date string.
 * Uses momentJS validation to validate that date string
 * is in the format set in the constants.
 * Remark: validation is skipped if the input value is undefined
 *
 * @param {string} value to validate
 * @param {string} format date format
 *
 * @return {boolean}
 */
const isDate = (value, format = DATE_FORMAT) => {
  return moment(value, format, true).isValid()
}

/**
 * Validates provided date object.
 * Uses momentJS validation to validate that date string
 * is in the format set in the constants.
 * Remark: validation is skipped if the input value is undefined
 *
 * @param {string} value to validate
 * @param {string} format date format
 *
 * @return {boolean}
 */
const isDateObject = (value, format = DATE_FORMAT) => {
  return (typeof value === 'object' &&
    Object.keys(value).length > 0 &&
    Object.keys(value).every((key) => isDate(value[key], format)))
}

/**
 * Validates provided date object.
 * Uses momentJS validation to validate that date string
 * is in the format set in the constants.
 * Remark: validation is skipped if the input value is undefined
 *
 * @param {string} value to validate
 * @param {string} format date format
 *
 * @return {boolean}
 */
const isDateRangeOptional = (value, format = DATE_FORMAT) => {
  return (typeof value === 'object' &&
    Object.keys(value).length > 0 &&
    Object.keys(value).every((key) => value[key] === '' || isDate(value[key], format)))
}

export default {

  /* Object is used to define variables that are passed
   * to the validator function localization messages
   */
  messageArgs : {
    isAfterMinDate : {
      minDate: moment(MIN_BIRTH_DATE, DATE_FORMAT)
        .format(DATE_COMPONENT_FORMAT, true)
    }
  },

  required,
  isNumber,
  isNumberObject,

  /**
   * Checkbox has to be checked (true)
   *
   * @param {*} value - value to be checked
   *
   * @return {boolean}
   */
  isChecked(value) {
    return typeof value === 'boolean' && value
  },

  /**
   * String of minimal length
   *
   * @param {string} value - value to be checked
   * @param {number} len - minimal length
   *
   * @return {boolean}
   */
  minLength(value, len) {
    return typeof value === 'string' && value.length >= len
  },

  /**
   * String of maximal length
   *
   * @param {string} value - value to be checked
   * @param {number} len - maximal length
   *
   * @return {boolean}
   */
  maxLength(value, len) {
    return typeof value === 'string' && value.length <= len
  },

  /**
   * String of to length
   *
   * @param {string} value - value to be checked
   * @param {number} len -  length
   *
   * @return {boolean}
   */
  exactLength(value, len) {
    return typeof value === 'string' && value.length === len
  },

  /**
   * String of minimal length
   *
   * @param {string} value - value to be checked
   * @param {number} len - minimal length
   *
   * @return {boolean}
   */
  longString(value) {
    return typeof value === 'string' &&
      value.length >= LONG_STRING_MIN &&
      value.length <= LONG_STRING_MAX
  },

  /**
   * Validates the provided phone number.
   *
   * Phone number must comply following requirements:
   *
   * - Phone number starts with + and international code
   * - Then followed by numbers that can be separated by space
   * - Number can has at most 15 digits including international code
   *
   * @param {string} value to validate
   *
   * @return {boolean}
   */
  isPhoneNumber(value) {
    return /^\+[0-9]{1,15}$/.test(value)
  },

  /**
   * Validates the provided email address.
   *
   * Email must comply with the following requirements:
   * - can have between 3 and 254 characters
   * - has only one "at" (@) sign
   * - has at least one sign on either side of "at"
   * - "at" is followed by any number of characters not including a dot (.)
   * - and ends with any number of patterns starting with a dot followed by at least
   *   one character
   *
   * @param {string} value to validate
   *
   * @return {boolean}
   */
  isEmail(value) {
    /* eslint-disable max-len */
    return typeof value === 'string'
      && value.length > EMAIL_MIN_LENGTH
      && value.length <= EMAIL_MAX_LENGTH
      && !!value.match(/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)+$/i)
    /* eslint-enable max-len */
  },

  isDate,
  isDateObject,
  isDateRangeOptional,

  /**
   * Checks if the provided string is Irish IBAN.
   * This is a basic check, real validation is done in the MW.
   * TODO: make this validation better
   *
   * @param {string} value to validate
   *
   * @return {boolean}
   */
  isIrishIBAN(value) {
    return !!value && typeof value === 'string' && value.indexOf('IE') !== -1
  },

  /**
   * Validates if provided date string is in past or is today.
   * Uses momentJS validation.
   *
   * @param {string} value to validate
   * @param {string} format date format
   *
   * @return {boolean}
   */
  isUpToToday(value, format = DATE_FORMAT) {
    return moment(value, format).isSameOrBefore(moment(now()))
  },

  /**
   * Validates if provided date string is in future or today.
   * Uses momentJS validation.
   *
   * @param {string} value to validate
   * @param {string} format date format
   *
   * @return {boolean}
   */
  isTodayOrAfter(value, format = DATE_FORMAT) {
    return moment(value, format).isSameOrAfter(moment(now()), 'day')
  },

  /**
   * Validates if provided date string is after 1900-01-01.
   *
   * @param {string} value to validate
   * @param {string} format date format
   *
   * @return {boolean}
   */
  isAfterMinDate(value, format = DATE_FORMAT) {
    var minDate = moment(MIN_BIRTH_DATE, DATE_FORMAT)
    return moment(value, format).isAfter(minDate)
  },

  /**
   * Validate if provided value is number in range
   *
   * @param {string} value to validate
   * @param {number} from
   * @param {number} to
   *
   * @return {boolean}
   */
  isNumberInRangeInclusive(value, from, to) {
    var floatValue = parseFloat(value)
    var floatFrom = parseFloat(from)
    var floatTo = parseFloat(to)

    return (!isNaN(floatValue) && !isNaN(floatFrom) && !isNaN(floatTo)
      && floatValue >= floatFrom && floatValue <= floatTo)
  },

  /**
   * Validate if provided value is number one of the ranges
   *
   * @param {string} value to validate
   *
   * @return {boolean}
   */
  isNumberInMultipleRangesInclusive(value, ...args) {
    const floatValue = parseFloat(value)
    return args.some(arg => {
      const floatFrom = parseFloat(arg[0])
      const floatTo = parseFloat(arg[1])

      return (!isNaN(floatValue) && !isNaN(floatFrom) && !isNaN(floatTo)
        && floatValue >= floatFrom && floatValue <= floatTo)
    })

  },

  /**
   * A value should not be greater than a maximum value
   *
   * @param {String} value - value to be checked
   * @param {String} maxValue - maximum value
   *
   * @return {boolean} true if a value is not exceeded the maximum value,
   *  otherwise - false
   */
  maxValue(value, maxValue) {
    const floatValue = parseFloat(value)
    const floatMax = parseFloat(maxValue)

    return !isNaN(floatValue) && !isNaN(floatMax) && floatValue <= floatMax
  },

  /**
   * A value should be greated then zero
   *
   * @param {string} value - value to be checked
   *
   * @return {boolean} true if a value is greater then zero
   */
  isPositiveValue(value) {
    return value > 0
  },

  /**
   * Allowed special character in alfanumeric string
   *
   * @param {string} value
   * @param {...string} characters
   *
   * @return {boolean}
   */
  allowedSpecialCharacters(value, ...characters) {
    const charactersString = characters.join('')
    const testRegexp = new RegExp('^[A-Za-z0-9' + charactersString + ']+$')
    return testRegexp.test(value)
  },

  /**
   * Phone number, returned by PhoneSelect component, has both
   * number and countryCode, neither is empty, and it contains no invalid characters
   *
   * @param {Object} value
   *
   * @return {boolean}
   */
  isFullPhoneNumber(value) {
    const number = value.number

    return typeof value === 'object'
      && number !== ''
      && value.countryCode !== ''
      && isNumber(number)
      && number.indexOf('+') === -1
      && number.indexOf('-') === -1
  }

}
