import { reportError } from 'apollo-appstore/utils/errors'

/**
 * Wrapper class for promise rejection
 *
 * @param {Object} payload - rejection body
 */
function ApiError(payload = {}) {
  this.name = 'ApiError'
  // Patch for
  // https://github.com/petkaantonov/bluebird/commit/e77224c191dc8942eb27c6ea95dce8e3fec8a570
  this.message = JSON.stringify(payload)
  this.body = payload
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(this, ApiError)
  }
  reportError(payload)
}
ApiError.prototype = Object.create(Error.prototype)

export default ApiError

