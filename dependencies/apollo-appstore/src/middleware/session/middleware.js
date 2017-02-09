import moment from 'moment'

import {
  isDefined,
  isUndefined,
  isEmptyString,
} from 'apollo-library/utils/common'

import {
  prolongToken,
} from '../../actions/authActions'
import {
  AS_AUTH_TOKEN_KEY,
  AS_AUTH_TOKEN_EXPIRATION,
  AS_AUTH_SESSION,
} from '../../constants/auth'

import {
  setStorage,
  clearStorage,
} from '../side-effect/actions'

import {
  AS_SESSION_SAVE,
  AS_SESSION_REMOVE,
} from './constants'

/* Threshold of seconds before the expiration prolongation is made */
const PROLONG_THRESHOLD = 60

/* How ofter we check if we are close to expiration date and should prolong */
const PROLONG_CHECK_INTERVAL = 5000


/**
 * Creates redux middleware for session and prolongation
 *
 * @returns {Object}
 */
export const createSession = () => {

  let store
  let prolongTimer

  /**
   * Stop prolongation timer
   */
  const stopProlongTimer = () => {
    if (prolongTimer) {
      clearTimeout(prolongTimer)
    }
  }

  /**
   * Starts prolongation timer
   * @param {string} expirationDate
   */
  const startProlongTimer = expirationDate => {
    if (isUndefined(expirationDate) || isEmptyString(expirationDate)) {
      return
    }

    stopProlongTimer()

    prolongTimer = setInterval(() => {
      const diff = moment(expirationDate).diff(moment(), 'seconds')

      if (diff <= PROLONG_THRESHOLD) {
        stopProlongTimer()
        store.dispatch(prolongToken())
      }
    }, PROLONG_CHECK_INTERVAL)
  }

  /**
   * Saves store into local clojure to trigger prolongation
   * @param {Object} realStore
   */
  const setStore = realStore => {
    store = realStore
  }

  /**
   * Middleware
   * @returns {function}
   */
  const middleware = () => next => action => {
    if (/^@session/.test(action.type)) {
      switch (action.type) {
        case AS_SESSION_SAVE: {
          const {
            jwt = {},
            ssid = {}
          } = action

          const {
            value: jwtValue,
            expirationDate: jwtExpirationDate,
          } = jwt

          const {
            value: ssidToken,
          } = ssid

          if (isDefined(jwtValue) && isDefined(jwtExpirationDate)) {
            next(setStorage(AS_AUTH_TOKEN_KEY, jwtValue))
            next(setStorage(AS_AUTH_TOKEN_EXPIRATION, jwtExpirationDate))

            if (ssidToken) {
              next(setStorage(AS_AUTH_SESSION, ssidToken))
            }

            startProlongTimer(jwtExpirationDate)
            return
          } else {
            throw 'Invalid JWT'
          }
        }

        case AS_SESSION_REMOVE: {
          stopProlongTimer()
          return next(clearStorage())
        }
      }
    } else {
      return next(action)
    }
  }

  return {
    setStore,
    startProlongTimer,
    middleware,
  }
}
