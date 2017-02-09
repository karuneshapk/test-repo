/**
 * Request has started
 *
 * @param {Object} state - redux state
 * @param {string} requestKey - request uuid
 *
 * @return {Object}
 */
export const requestStart = (state, requestKey) => {
  var requests = state.get('requests')

  return {
    isRequesting: true,
    requests: requests.push(requestKey)
  }
}

/**
 * Request has ended
 *
 * @param {Object} state - redux state
 * @param {string} requestKey - request uuid
 *
 * @return {Object}
 */
export const requestEnd = (state, requestKey) => {
  var requests = state.get('requests')

  return {
    isRequesting: !!(Math.max(0, requests.size - 1)),
    requests: requests.filter(key => key !== requestKey)
  }
}

