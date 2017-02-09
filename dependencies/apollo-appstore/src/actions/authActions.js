import { push } from 'react-router-redux'

import { isDefined, prefixedRelativeUrl } from 'apollo-library/utils/common'

import { callApi, AS_AUTH_JWT } from '../middleware/api'
import { freezeApp } from '../middleware/freeze/actions'
import { saveSession, removeSession } from '../middleware/session/actions'
import {
  pushExternal,
} from '../middleware/side-effect/actions'

import {
  AS_AUTH_DEVICE_ID
} from '../constants/auth'

import { AS_ENDPOINTS_NAME } from '../constants/endpoints'

import { AS_AGENDA_SYSTEM } from '../constants/agendas'

import { loadMice } from './modulesActions'
import { setAgendaKey } from './agendaActions'

/**
 * Sets device id
 *
 * @param {string} deviceId - device id
 * @returns {Object}
 */
export const setDeviceId = deviceId => setAgendaKey(AS_AGENDA_SYSTEM, AS_AUTH_DEVICE_ID, deviceId)

 /**
 * sets new JWT token under SYSTEM agenda (new user just logged in) and emits
 * request for available modules
 *
 * @param {Object} jwt - JWT token proving identity
 * @param {Object} ssid - SSID
 * @returns {function}
 */
export const setSession = (jwt, ssid) => dispatch => {
  dispatch(saveSession(jwt, ssid))
  return dispatch(loadMice())
}

/**
 * unsets current JWT token from SYSTEM agenda (user lost his identity returing
 * to anynymous mode and emits redirect to root (just in case)
 *
 * @param {function} dispatch
 *
 * @returns {function(dispatch:function, getState:function):Promise} redux action
 */
export const resetContext = () => dispatch => {
  dispatch(removeSession())
  return dispatch(loadMice()).then((payload) => {
    dispatch(push(prefixedRelativeUrl()))
    return payload
  })
}

/**
 * audit logout action to middleware
 *
 * @param {Object} options
 * @returns {function}
 */
export const logout = (options = {}) => dispatch => {
  dispatch(callApi({
    endpointsName: AS_ENDPOINTS_NAME,
    method: 'logout',
    ...options
  }))
  dispatch(resetContext())
}

/**
 * prolong token
 *
 * @param {Object} options
 * @returns {function}
 */
export const prolongToken = () => dispatch => {
  return dispatch(callApi({
    endpointsName: AS_ENDPOINTS_NAME,
    method: 'prolong',
    auth: AS_AUTH_JWT,
  })).then(({ jwtToken }) => {
    dispatch(saveSession(jwtToken))
  })
}

/**
 * Creates an action to get service token
 *
 * @returns {Object} redux action
 */
export const generateServiceTicket = () => callApi({
  endpointsName: AS_ENDPOINTS_NAME,
  method: 'generateServiceTicket',
  auth: AS_AUTH_JWT,
})

/**
 * Redirect to incompatible application with service ticket proving identity
 *
 * @param {Object} url - url to redirect
 * @param {Object} params - additional queryString
 *
 * @returns {function(dispatch:function):Promise} redux action
 */
export const redirectWithServiceTicket = (url = '', params = {}) => {
  return dispatch => {
    /* generate service ticket */
    return dispatch(generateServiceTicket())
      .then(({ serviceTicket }) => {

        const query = {
          ticket: serviceTicket,
          ...params
        }

        const [rawUrl, presentQuery] = url.split('?')

        if (isDefined(presentQuery)) {
          presentQuery.split('&').reduce((query, pair) => {
            const [ key, value ] = pair.split('=')
            query[key] = value
            return query
          }, query)
        }

        /* construct queryString */
        const queryString = []

        Object.keys(query).forEach(key => {
          const value = query[key]
          if (isDefined(value)) {
            queryString.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
          }
        })

        dispatch(removeSession())
        /* redirect */
        dispatch(pushExternal(`${rawUrl}?${queryString.join('&')}`))
        dispatch(freezeApp())
      })
  }
}
