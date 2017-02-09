import {
  makeRequest,
  getFetchArgs,
} from './common'

/**
 * Api method that calls restful service method
 *
 * @param {Object} data
 *
 * @returns {Promise} chain link
 */
export default ({ method, headers, body, endpoint }) => {
  const requestHeaders = {
    'accept': 'application/json',
    'content-type': 'application/json',
    ...(headers || {}),
  }

  const fetchArgs = getFetchArgs(requestHeaders, method, body, true)

  return makeRequest(endpoint, fetchArgs)
}
