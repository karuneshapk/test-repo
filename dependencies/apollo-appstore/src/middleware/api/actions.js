import { AS_API_CALL } from './constants'

/**
 * Calls api outside module
 *
 * @param {Object} call - call description, needs to contain pula entry
 * @param {Object} payload - additional payload
 *
 * @returns {Object}
 */
export const callApi = (call = {}, payload) => ({
  [AS_API_CALL]: { ...call },
  payload
})
