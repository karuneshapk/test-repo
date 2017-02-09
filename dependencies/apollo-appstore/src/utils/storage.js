import { hash } from 'apollo-library/utils/math'

const storage = (window.sessionStorage || { clear: () => {}})

const hashPrefix = '@'
const hasher = value => `${hashPrefix}${hash(value, 256)}`
const expireAllCookies = () => {
  document.cookie.split(';').forEach(c => {
    var [ name ] = c.split('=')
    document.cookie = `${name}=;expires=Thu, 21 Sep 1979 00:00:01 UTC; path=/`
  })
}

export default {
  /**
   * Unloader of session storage and intercom side effects
   */
  clear: () => {
    expireAllCookies()
    storage.clear()
  },

  /**
   * Setter for internal storage
   *
   * @param {string} key
   * @param {*} value
   */
  set: (key, value) => {
    storage[hasher(key)] = value
  },

  /**
   * Getter for internal storage
   *
   * @param {string} key
   *
   * @returns {*} stored value
   */
  get: key => storage[hasher(key)],

  /**
   * Deleter for internal storage
   *
   * @param {string} key
   */
  remove: key => {
    const hashed = hasher(key)
    delete storage[hashed]
  }
}
