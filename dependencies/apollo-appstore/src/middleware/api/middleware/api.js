/**
 * @typedef ApiRequest
 * @type Object
 * @property {string} service - the enpoint's service
 * @property {string} endpoint - endpoint path
 * @property {*} payload - body of the request
 * @property {?Object} headers - headers
 * @property {Object} actions - actions (request, success, error)
 * @property {?Object} options - various options (such as downloadFilename)
 * @property {Object} actionPayload - additional action's payload
 * @property {string} method - HTTP method (get, post, delete, put)
 * @property {string} methodName - endpoint method name
 * @property {Object} endpointMethod - endpoint method
 * @property {?Object} urlParams - url params to be filled into url placeholders
 * @property {boolean|string} authNOk - auth mechanism or false when there is no authorization
 * @property {boolean} downloadCall - if we should call download
 * @property {boolean} uploadCall - if we should call upload
 */

import { formNotSubmitting } from 'apollo-library/actions/form'
import { isNil, isDefined, prefixedRelativeUrl } from 'apollo-library/utils/common'
import ApiError from '../apiError'
import { resetContext } from 'apollo-appstore/actions/authActions'

import remote from '../calls/remote'
import download from '../calls/download'
import upload from '../calls/upload'

import {
  AS_API_CALL_DEFAULT_PROXY,
  AS_API_ERROR_STATUS_BAD_REQUEST,
  AS_API_ERROR_STATUS_UNAUTHORIZED,
  AS_API_ERROR_STATUS_FORBIDDEN,
  AS_API_ERROR_STATUS_NOT_FOUND,
  AS_API_ERROR_STATUS_TOO_LARGE,
  AS_API_ERROR_STATUS_ADDITIONAL_AUTHORIZATION_REQUIRED,
  AS_API_ERROR_STATUS_SERVER_ERROR
} from '../constants'

import {
  apiLoggedOutMsg,
  authRequiredAction,
  apiForbidden,
  apiGlobalErrorMsg,
  apiFatalErrorMsg,
  serverError,
} from './apiActions'

import { authenticate } from '../auth'

/**
 * Assembles full address for endpoint using app route
 * @param {Object} state - store's state
 * @param {string} endpoint - endpoint
 * @param {?string} service - service name
 * @param {?Object} urlParams - dynamic params for url
 *
 * @returns {?string}
 */
export const getFullEndpointPath = (state, endpoint, service, urlParams) => {
  const proxy = service
    ? state.root.modules.getIn([ 'services', service ])
    : AS_API_CALL_DEFAULT_PROXY

  if (urlParams) {
    Object.keys(urlParams).forEach(param => {
      endpoint = endpoint.replace(`:${param}`, urlParams[param])
    })
  }

  return proxy && prefixedRelativeUrl(proxy, endpoint)
}

/**
 * Dispatch valid endpoint call
 *
 * @param {function} next - next middleware to call
 * @param {Object} state - store state
 * @param {ApiRequest} request - request object
 *
 * @returns {Promise}
 */
export function apiCall(next, state, request) {
  const {
    method,
    endpoint,
    headers,
    payload,
    options,
    actions,
    actionPayload,
    service,
    urlParams,
    uploadCall,
    downloadCall,
    authNOk
  } = request

  if (authNOk) {
    return Promise.reject(new ApiError())
  }

  const fullEndpoint = getFullEndpointPath(state, endpoint, service, urlParams)

  if (!fullEndpoint) {
    return Promise.reject(new ApiError({
      message: `Invalid enpoint, service "${service}" is not found`
    }))
  }

  if (isDefined(actions.request)) {
    next({
      type: actions.request,
      payload,
      ...actionPayload
    })
  }

  const filename = options && options.downloadFilename
  const openFile = options && options.open

  if (uploadCall) {
    return upload({
      method,
      headers,
      endpoint: fullEndpoint,
      body: payload
    })
  } else if (downloadCall) {
    return download({
      method,
      headers,
      endpoint: fullEndpoint,
      body: payload,
      options: {
        filename,
        open: openFile
      }
    })
  } else {
    return remote({
      method,
      headers,
      endpoint: fullEndpoint,
      body: payload
    })
  }
}

/**
 * Creates a handler for success response
 *
 * @param {function} next - next middleware to call
 * @param {*} actionPayload - additional payload for action
 * @param {Object} actions - callback actions
 *
 * @returns {function}
 */
const apiSuccessHandler = (next, actionPayload = {}, actions = {}) => response => {
  const payload = isDefined(response.payload)
    ? response.payload
    : response

  const headers = response.headers || {}

  if (actionPayload.formName
    && !actionPayload.skipFormNotSubmitting) {
    next(formNotSubmitting(actionPayload.formName))
  }

  if (isDefined(actions.success)) {
    next({
      type: actions.success,
      headers,
      payload,
      ...actionPayload
    })
  }

  return Promise.resolve(payload)
}

/**
 * Creates a handler for error response
 *
 * @param {function} dispatch - storage dispatch function
 * @param {function} next - next middleware to call
 * @param {Object} state - store's state
 * @param {ApiRequest} request - request object (see createApiRequest)
 *
 * @returns {function}
 */
function apiErrorHandler(dispatch, next, state, request) {
  return response => {
    if (!(response instanceof ApiError)) {
      response = new ApiError(response)
    }

    const {
      moduleName,
      methodName,
      payload,
      actions,
      actionPayload,
      endpointMethod: { upload }
    } = request

    const error = response.body
    const errPayload = error.payload || error
    const statusCode = error.statusCode || AS_API_ERROR_STATUS_BAD_REQUEST
    const headers = error.headers || {}

    if (actionPayload && actionPayload.formName) {
      next(formNotSubmitting(actionPayload.formName))
    }

    // Handle specific status codes
    switch (statusCode) {

      case AS_API_ERROR_STATUS_ADDITIONAL_AUTHORIZATION_REQUIRED: {
        next(authRequiredAction(
          methodName,
          errPayload,
          actionPayload,
          headers,
          payload,
          moduleName
        ))
        return Promise.reject(response)
      }

      case AS_API_ERROR_STATUS_FORBIDDEN: {
        next(apiForbidden(
          methodName,
          errPayload,
          actionPayload,
          headers,
          payload,
          moduleName
        ))
        return Promise.reject(response)
      }

      case AS_API_ERROR_STATUS_UNAUTHORIZED: {
        return dispatch(resetContext()).then(payload => {
          dispatch(apiLoggedOutMsg())
          return payload
        }).catch(() => new ApiError())
      }
    }

    // This is a duck test for an upload rejected by the browser or the balancer
    // Probably the upload is too big,
    // or the file was moved on the disc during the upload process
    const isUploadError =
      statusCode === AS_API_ERROR_STATUS_TOO_LARGE
      || !isDefined(error.statusCode)
      && !isDefined(errPayload.errors)
      && upload

    // General error action (for FORMS compatibility)
    next(serverError(headers, payload, methodName, statusCode,
          errPayload.errors, actionPayload, isUploadError))

    if (isDefined(actions.error)) {
      next({
        type: actions.error,
        headers,
        request: payload,
        statusCode,
        errors: errPayload.errors,
        ...actionPayload
      })
    }

    if ((statusCode >= AS_API_ERROR_STATUS_SERVER_ERROR
        || statusCode === AS_API_ERROR_STATUS_NOT_FOUND)
        && (!actionPayload || !actionPayload.noFatalError)) {
      next(isNil(errPayload.idCall)
        ? apiFatalErrorMsg()
        : apiGlobalErrorMsg(errPayload.idCall)
      )
    }

    return Promise.reject(response)
  }
}

/**
 * Trigger API request including trigger pre request action
 *
 * @param {function} next - next middleware to call
 * @param {Object} state - store's state
 * @param {ApiRequest} request - request object
 * @param {function} dispatch - store sispatch function
 *
 * @returns {Promise}
 */
export const apiRequest = (next, state, request, dispatch) => apiCall(next, state, request)
  .then(apiSuccessHandler(
    next,
    request.actionPayload,
    request.actions
  ))
  .catch(apiErrorHandler(
    dispatch,
    next,
    state,
    request
  ))


/**
 * Creates an object to be passed along the calls with all the request information
 *
 * @param {Object} endpointMethodName - name of the endpoint method
 * @param {Object} endpointMethod - endpoint definition entry
 * @param {Object} apiAction - api action
 * @param {?Object} actionPayload - action payload
 * @param {string} deviceId
 *
 * @returns {ApiRequest}
 */
export function createApiRequest(
  endpointMethodName,
  endpointMethod = {},
  apiAction = {},
  actionPayload,
  deviceId,
) {

  const {
    payload,
    params,
    actions,
    options,
    auth,
    headers,
    httpMethod,
    upload: actionUpload,
    download: actionDownload,
    endpoint: actionEndpoint,
    service: actionService,
  } = apiAction

  const {
    endpoint,
    service,
    headers: endpointHeaders,
    method,
    upload,
    download,
    auth: authOverride
  } = endpointMethod

  const finalAuth = isDefined(authOverride) ? authOverride : auth
  const authHeaders = finalAuth && authenticate(finalAuth)

  // language is hard-coded for now
  const mergedHeaders = {
    'x-active-language': 'cs',
    'device': deviceId,
    ...(endpointHeaders || {}),
    ...headers,
    ...(authHeaders || {})
  }

  return {
    service: actionService || service,
    endpoint: actionEndpoint || endpoint,
    payload: endpointMethod && endpointMethod.mapRequest
      ? endpointMethod.mapRequest(payload)
      : payload,
    headers: mergedHeaders,
    actions: actions || {},
    options,
    actionPayload,
    method: httpMethod || method,
    endpointMethod,
    methodName: endpointMethodName,
    urlParams: params,
    authNOk: finalAuth && !authHeaders,
    uploadCall: actionUpload || upload,
    downloadCall: actionDownload || download,
  }
}
