import React from 'react'
import { FormattedMessage } from 'react-intl'
import { isDefined } from 'apollo-library/utils/common'
import { addNotification } from 'apollo-library/actions/notifications'
import {
  SERVER_AUTH_REQUIRED,
  SERVER_ERROR,
} from 'apollo-library/constants/actions'
import {
  AS_API_UNKNOWN_METHOD,
  AS_API_FORBIDDEN,
  AS_API_LOGGED_OFF_NOTIFICATION_ID,
} from '../constants'
import messages from '../messages'

/**
 * Invalid action creator
 *
 * @returns {Object} redux action
 */
export const apiUnknownMethodAction = () => ({
  type: AS_API_UNKNOWN_METHOD
})

/**
 * Logged out notification action creator
 *
 * @returns {Object} redux action
 */
export const apiLoggedOutMsg = () => addNotification({
  text: <FormattedMessage {...messages.forceLogout} />,
  type: 'danger'
}, AS_API_LOGGED_OFF_NOTIFICATION_ID)

/**
 * Global error notification action creator
 *
 * @param {*} idCall - call id
 * @returns {Object} redux action
 */
export const apiGlobalErrorMsg = idCall => addNotification({
  text: isDefined(idCall)
    ? (
        <FormattedMessage
          {...messages.serverGenericErrorWithId}
          values={{ idCall }}
        />
      )
    : (
      <FormattedMessage {...messages.serverGenericError} />
    ),
  type: 'danger'
})

/**
 * Fatal error notification action creator
 *
 * @returns {Object} redux action
 */
export const apiFatalErrorMsg = () => addNotification({
  text: (
    <FormattedMessage {...messages.serverGenericError} />
  ),
  type: 'danger'
})

/**
 * Auth required action creator
 *
 * @param {string} methodName - name of module api's method that invoked
 *  original request
 * @param {*} payload - error payload
 * @param {*} actionPayload - additional payload provided to the action
 * @param {Object} headers - headers from request
 * @param {Object} request - original request
 * @param {string} moduleName - module's name which the api action belongs to
 *
 * @returns {Object} redux action
 */
export const authRequiredAction = (methodName, payload, actionPayload, headers, request, moduleName) => ({ // eslint-disable-line max-len
  type: SERVER_AUTH_REQUIRED,
  headers,
  request,
  methodName,
  moduleName,
  payload,
  ...actionPayload
})

/**
 * Forbidden action creator
 *
 * @param {string} methodName - name of module api's method that invoked
 *  original request
 * @param {*} payload - error payload
 * @param {*} actionPayload - additional payload provided to the action
 * @param {Object} headers - headers from request
 * @param {Object} request - original request
 * @param {string} moduleName - module's name which the api action belongs to
 *
 * @returns {Object} redux action
 */
export const apiForbidden = (methodName, payload, actionPayload, headers, request, moduleName) => ({
  type: AS_API_FORBIDDEN,
  headers,
  request,
  methodName,
  moduleName,
  payload,
  ...actionPayload
})

/**
 * Server error action
 *
 * @param {Object} headers - headers
 * @param {Object} request - payload data
 * @param {string} methodName - method name
 * @param {number} statusCode - status code
 * @param {Object} errors - errors
 * @param {Object} payload - optional payload
 * @param {boolean} isUploadError - browser or connection error with upload
 *
 * @returns {Object}
 */
export const serverError = (headers, request, methodName, statusCode,
  errors, payload = {}, isUploadError = false) => ({
    type: SERVER_ERROR,
    headers,
    request,
    methodName,
    statusCode,
    errors,
    isUploadError,
    ...payload
  })
