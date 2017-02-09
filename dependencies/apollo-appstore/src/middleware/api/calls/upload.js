import { isDefined } from 'apollo-library/utils/common'
import {
  makeRequest,
} from './common'

/**
 * Adds form data to body
 * @param {Object} fetchArgs
 * @param {?Object|FormData} body
 * @returns {Object}
 */
const addFormDataBody = (fetchArgs, body) => {
  let newBody
  if (!isDefined(body)) {
    newBody = new FormData()
  } else if (FormData.prototype.isPrototypeOf(body)) {
    newBody = body
  } else {
    const formData = new FormData()
    for (const prop in body) {
      formData.append(prop, body[prop])
    }
    newBody = formData
  }

  return {
    ...fetchArgs,
    body: newBody,
  }
}

/**
 * Api method that calls binary service method
 *
 * @param {Object} data
 *
 * @returns {Promise} chain link
 */
export default ({ method, headers, body, endpoint }) => {
  const requestHeaders = {
    'accept': 'application/json',
    ...(headers || {})
  }

  const fetchArgs = addFormDataBody({
    headers: requestHeaders,
    method: method || 'post'
  }, body)

  return makeRequest(endpoint, fetchArgs, method)
}
