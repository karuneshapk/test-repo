import {
  AS_SESSION_SAVE,
  AS_SESSION_REMOVE,
} from './constants'

/**
 * set session data action creator
 *
 * @param {Object} jwt - JWT token proving identity
 * @param {?Object} ssid - SSID
 *
 * @returns {Object}
 */
export const saveSession = (jwt, ssid) => ({
  type: AS_SESSION_SAVE,
  jwt,
  ssid,
})


/**
 * remove session action creator
 *
 * @returns {Object}
 */
export const removeSession = () => ({
  type: AS_SESSION_REMOVE,
})

