import { AS_REGISTER_ENDPOINTS } from '../constants/actions'

/**
 * Register endpoints action creator
 * @param {string} endpointsName - endpoinst name - usually module name
 * @param {Object} endpoints - endpoints definition map
 * @returns {Object}
 */
export const registerEndpoints = (endpointsName, endpoints) => ({
  type: AS_REGISTER_ENDPOINTS,
  endpointsName,
  endpoints,
})
