import { isDefined, isFunction } from 'apollo-library/utils/common'
import { AS_AUTH_JWT } from './constants'
import { getToken, getSessionId } from '../../utils/auth'

const AUTH_PROVIDERS = {

  /**
   * Apollo JWT authorization
   *
   * @param {Array} data - PULA authorization parameter
   *
   * @returns {Array} PULA payload with injected authorization or null when no
   *  token available
   */
  [AS_AUTH_JWT]: (data = {}) => {
    const token = getToken()

    return isDefined(token) && {
      ...data,
      'authorization': `Bearer ${token}`
    }
  }

}

/**
 * Add session id to headers
 * @param {Object} headers - existing headers
 * @returns {Object}
 */
const addAuthSessionId = headers => {
  const sessionId = getSessionId()

  if (sessionId) {
    return {
      ...headers,
      ssid: sessionId,
    }
  } else {
    return headers
  }
}

/**
 * Injects authorization data into PULA body based on authorization provider
 *
 * @param {string} auth - authorization enum
 * @param {Array} data - PULA authorization parameter
 *
 * @returns {Array} PULA payload with injected authorization or null when auth
 *  mechanism isn't available
 */
export const authenticate = (auth, data = {}) => {
  const result = auth && isFunction(AUTH_PROVIDERS[auth]) && AUTH_PROVIDERS[auth](data)
  return addAuthSessionId(result ? result : data)
}
