import { SERVER_ERROR } from 'apollo-library/constants/actions'

/**
 * Server error action
 * @param {Object} headers - headers
 * @param {Object} request - payload data
 * @param {string} methodName - method name
 * @param {number} statusCode - status code
 * @param {Object} errors - errors
 * @param {Object} payload - optional payload
 * @returns {Object}
 */
export const serverError = (headers, request, methodName, statusCode, errors, payload = {}) => ({
  type: SERVER_ERROR,
  headers,
  request,
  methodName,
  statusCode,
  errors,
  ...payload
})
