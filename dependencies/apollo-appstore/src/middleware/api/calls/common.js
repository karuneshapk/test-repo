import { isDefined, isFunction } from 'apollo-library/utils/common'
import ApiError from '../apiError'

const CONTENT_TYPE_PARSERS = {
  'json': response => response.json(),
  'blob': response => response.blob(),
}

/**
 * returns content type
 *
 * @param {Headers|Object} headers - content type
 * @param {Response} response
 * @param {?string} overrideType
 *
 * @returns {?string}
 */
export const parseResponse = (headers, response, overrideType) => {
  const contentType = overrideType || getContentType(headers['content-type'])

  if (contentType && CONTENT_TYPE_PARSERS[contentType]) {
    return CONTENT_TYPE_PARSERS[contentType](response)
  }

  return response.text()
}

/**
 * returns content type
 *
 * @param {string} contentType - content type
 *
 * @returns {?string}
 */
export const getContentType = contentType => {
  if (isDefined(contentType)) {
    const matched = contentType.match(/[^\/]+\/([^\s;]+)/)

    if (matched) {
      return matched[1]
    }
  }

  return null
}

/**
 * Deserializes headers from standard and non standard implementations of
 * fetche's Headers class into dict
 *
 * @param {Headers|Object} headers - Headers from fetch
 *
 * @returns {Object} key-value headers in dict
 */
export const getResponseHeaders = (headers = {}) => {
  const result = {}

  try {
    if (isFunction(headers.forEach)) {
      /* Standard FETCH implementation e.g. Chrome, Safari, Polyfill */
      headers.forEach((value, key) => {
        result[key] = value
      })
    /* Non standard FETCH implementation e.g. Firefox */
    } else if (isFunction(headers.entries)) {
      /* Crude way for firefox and non standard implementations of */
      const entries = headers.entries()

      if (isDefined(entries)) {
        for (const value of entries) {
          try {
            result[value[0]] = value[1]
          } catch(e) {
            /* pass */
          }
        }
      }
    }
  } catch(e) {
    /* pass */
  }
  return result
}

/**
 * Creates response
 * @param {Headers} headers
 * @param {Response} response
 * @param {*} payload  - response payload
 * @param {*} body - request body
 * @param {string} methodName
 * @returns {Object}
 */
export const createResponse = (headers, response, payload, body, methodName) => ({
  headers,
  statusCode: response.status,
  payload,
  request: {
    payload: body,
    methodName,
  },
})

/**
 * Creates response
 * @param {Headers} requestHeaders
 * @param {string} method
 * @param {*} body - request body
 * @param {boolean} addBody - whether add body to args or not
 * @returns {Object}
 */
export const getFetchArgs = (requestHeaders, method, body, addBody = false) => {
  const hasBody = isDefined(body)

  const fetchArgs = {
    headers: requestHeaders,
    method: method || (hasBody ? 'post' : 'get'),
    credentials: 'same-origin'
  }

  if (addBody && hasBody) {
    return {
      ...fetchArgs,
      body: typeof body === 'string'
        ? body
        : JSON.stringify(body)
    }
  }

  return fetchArgs
}

export const makeRequest = (endpoint, fetchArgs, method, options = {}) => {
  return fetch(endpoint, fetchArgs).then(response =>
    processResponse(
      response,
      fetchArgs.body,
      method,
      options,
    )
  )
}
export const defaultErrorHandler = (data, normalizedResponse) => new ApiError(normalizedResponse)
export const defaultSuccessHandler = (data, normalizedResponse) => normalizedResponse
export const processResponse = (response, body, method, options) => {
  const {
    success,
    error,
    overrideType,
  } = options

  const processSuccess = success || defaultSuccessHandler
  const processError = error || defaultErrorHandler
  const responseHeaders = getResponseHeaders(response.headers)

  return new Promise((resolve, reject) => {
    parseResponse(responseHeaders, response, overrideType).then(payload => {
      const normalizedResponse = createResponse(responseHeaders, response, payload, body, method)

      if (response.ok) {
        return resolve(processSuccess(payload, normalizedResponse))
      } else {
        return reject(processError(payload, normalizedResponse))
      }
    }).catch(payload => {
      const normalizedResponse = createResponse(responseHeaders, response, payload, body, method)
      return reject(processError(payload, normalizedResponse))
    })
  })
}
