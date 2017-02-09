import { isNil } from 'apollo-library/utils/common'
import storage from './storage'
import {
  AS_AUTH_TOKEN_KEY,
  AS_AUTH_TOKEN_EXPIRATION,
  AS_AUTH_SESSION,
  AS_AUTH_DEVICE_ID
} from '../constants/auth'
import { AS_AGENDA_SYSTEM } from '../constants/agendas'

/**
 * Returns session id
 *
 * @returns {string?}
 */
export const getSessionId = () => storage.get(AS_AUTH_SESSION)

/**
 * Returns token if present
 *
 * @returns {string?}
 */
export const getToken = () => storage.get(AS_AUTH_TOKEN_KEY)

/**
 * Returns token if present
 *
 * @returns {string?}
 */
export const getTokenExpiration = () => storage.get(AS_AUTH_TOKEN_EXPIRATION)

/**
 * Returns true if user is authenticated (token is present)
 *
 * @returns {boolean}
 */
export const isAuthenticated = () => !isNil(getToken())

/**
 * Returns device id from store
 *
 * @param {Object} state
 * @returns {?string}
 */
export const getDeviceId = (state) => state.root.agendas.getIn([
  AS_AGENDA_SYSTEM,
  AS_AUTH_DEVICE_ID
])
