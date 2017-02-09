import { isDefined } from 'apollo-library/utils/common'

import {
  getFetchArgs,
  makeRequest,
} from './common'

const download = (data, filename, options) => {
  // create url object from blob
  const URL = window.URL || window.webkitURL;
  const uri = URL.createObjectURL(data);

  // create element to host a link to blob
  const link = document.createElement('a')
  link.href = uri
  link.target = '_blank'

  // if not set to display file, set download prop to link
  if (!options.open) {
    link.download = filename
  }

  // add anchor element to dom and click on it
  // Firefox and Safari need this to be added to dom
  document.body.appendChild(link);
  link.click()


  // clean up
  // setTimeout is Firefox fix
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(uri)
  }, 0)
}

/**
 * Api method that calls binary service method
 *
 * @param {Object} data
 *
 * @returns {Promise} chain link
 */
export default ({ method, endpoint, headers, body, options }) => {
  const hasBody = isDefined(body)
  const requestHeaders = {
    'accept': 'application/json, application/octet-stream',
    'content-type': (hasBody ? 'application/json' : 'application/octet-stream'),
    ...(headers || {}),
  }

  const fetchArgs = getFetchArgs(requestHeaders, method, body, true)
  const originalFilename = options && options.filename

  return makeRequest(endpoint, fetchArgs, method, {
    overrideType: 'blob',
    success: (data, normalizedResponse) => {
      const {
        headers,
      } = normalizedResponse

      const contentDisposition = headers['content-disposition']
      const matched = contentDisposition && contentDisposition.match(/filename=(.+)/)
      const filename = matched ? matched[1] : originalFilename

      const processedResponse = {
        ...normalizedResponse,
        payload: filename,
      }

      download(data, filename, options)
      return processedResponse
    }
  })
}
