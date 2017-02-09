import { CURRENCY_SYMPOLS } from 'apollo-library/constants/components'
import { serverTime } from 'apollo-library/utils/time'

/**
 * @see Utils object method now
 *
 * @return {Date}
 */
export const now = () => serverTime().toDate()

/**
 * Trim string. Actually trims all control characters.
 * Ignores fancy Unicode spaces. Forces to string.
 *
 * 1.2x faster than native C implementation
 *
 * @param {string} str
 *
 * @return {string}
 */
export const trim = str => {
  str = String(str)
  let begin = 0
  let end = str.length - 1
  while (begin <= end && str.charCodeAt(begin) < 33) {
    ++begin
  }
  while (end > begin && str.charCodeAt(end) < 33) {
    --end
  }
  return str.substr(begin, end - begin + 1)
}

/**
 * Current browser-safe way to test whenever a variable is not undefined
 *
 * @param {*} _ implicit
 *
 * @return {boolean} true if variable is not underined
 */
export const isDefined = _ => _ !== void 0

/**
 * Current browser-safe way to test whenever a variable is undefined
 *
 * @param {*} _ implicit
 *
 * @return {boolean} true if variable is underined
 */
export const isUndefined = _ => _ === void 0

/**
 * Current browser-safe way to test whenever a variable is NIL
 *
 * @param {*} _ implicit
 *
 * @return {boolean} true if variable is NIL
 */
export const isNil = _ => isUndefined(_) || (_ === null)

/**
 * Test whenever variable is not set
 *
 * @param {*} _ implicit
 *
 * @return {boolean} true if x is nil or empty string
 */
export const isEmptyString = _ => isNil(_) || _ === ''

/**
 * Test whenever variable is function
 *
 * @param {*} _
 * @return {boolean} true if is function
 */
export const isFunction = _ => typeof _ === 'function'

/**
 * Find currrency symbol from known symbols
 *
 * @param {string} currencyCode
 *
 * @return {string}
 */
export const getCurrencySymbol = currencyCode => isNil(CURRENCY_SYMPOLS[currencyCode])
  ? currencyCode
  : CURRENCY_SYMPOLS[currencyCode]

/**
 * Get query parameter from URL by name
 * @see http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 *
 * In case of SSO ticket query param, get rid of slash (there were problems in
 * removing ticket from URL)
 *
 * @param {string} name - Name of query parameter
 * @return {string} - value of query parameter
 */
export const getQueryParamByName = (name:string) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')

  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`)
  const r = regex.exec(location.search)

  //why is there a "ticket" in this function hardcoded?!
  //FIXME use isNil
  return r === null
    ? ''
    : decodeURIComponent(name === 'ticket' ? r[1].replace('/', '') : r[1].replace(/\+/g, ' ')
  )
}

/**
 * Creates a duplicate-free version of an array
 * @example ['a', 'b', 'c', 'a'] => ['a', 'b', 'c']
 *
 * @param {Array} _ implicit flatten array
 * @return {Array}
 */
export const removeDuplicates = _ => _.filter((v, i, j) => j.indexOf(v) === i, this)

/**
 * Base64 data to blob for file upload
 *
 * @param {string} dataURI
 * @return {Blob}
 */
export const dataURItoBlob = dataURI => {
  /* global unescape */
  const data = dataURI.split(',')
  // separate out the mime component
  let mimeString = data[0].match(/:(.*?);/)

  mimeString = (mimeString && mimeString.length > 1)
    ? mimeString[1]
    : 'text/plain'

  // convert base64/URLEncoded data component to raw binary held in a string
  const byteString = data[1]
    ? (data[0].indexOf('base64') >= 0
        ? atob(data[1])
        : unescape(data[1])
      )
    : ''

  let len = byteString.length

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(len)

  while (len--) {
    ia[len] = byteString.charCodeAt(len)
  }

  return new Blob([ia], { type: mimeString })
}

/**
 * Join relative url parts with webpack PUBLIC_PATH prefix
 *
 * @param  {...string} urlParts Joined relative url parts
 * @return {string}
 */
export const prefixedRelativeUrl = (...urlParts) =>
  joinRelativeURL(process.env.PUBLIC_PATH || '/', ...urlParts)

/**
 * Join relative url parts
 *
 * @param  {...string} urlParts Joined relative url parts
 * @return {string}
 */
export const joinRelativeURL = (...urlParts) => {
  var parts = []

  for (const part of urlParts) {
    parts = parts.concat(part.split('/'))
  }
  parts = parts.filter(item => isEmptyString(item) === false)

  return `/${parts.join('/')}`
}
