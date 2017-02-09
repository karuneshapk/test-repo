import {
  AS_REDIRECT_TO_URI,
  AS_STORAGE_SET,
  AS_STORAGE_CLEAR,
  AS_STORAGE_REMOVE
} from './constants'

/**
 * Push to external uri
 * Redirect to address and not save to history session
 * @example pushExternal('https://google.com/')
 *
 * @param {string} uri Uri to redirect
 * @returns {Object}
 */
export const pushExternal = uri => ({
  type: AS_REDIRECT_TO_URI,
  uri
})

/**
 * Clear storage
 *
 * @returns {Object}
 */
export const clearStorage = () => ({
  type: AS_STORAGE_CLEAR
})

/**
 * Set storage key
 *
 * @param {string} key
 * @param {*} value
 * @returns {Object}
 */
export const setStorage = (key, value) => ({
  type: AS_STORAGE_SET,
  key,
  value
})

/**
 * Remove storage key
 *
 * @param {string} key
 * @param {*} value
 * @returns {Object}
 */
export const removeStorage = key => ({
  type: AS_STORAGE_REMOVE,
  key
})
