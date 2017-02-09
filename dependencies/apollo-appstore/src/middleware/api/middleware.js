import { handleErrors } from 'apollo-appstore/utils/errors'
import { getDeviceId } from 'apollo-appstore/utils/auth'

import ApiError from './apiError'
import { apiUnknownMethodAction } from './middleware/apiActions'
import { AS_API_CALL } from './constants'
import { apiRequest, createApiRequest } from './middleware/api'
import {
  invalidAction,
  isValidAction
} from './middleware/validation'

/**
 * Invokes API Call
 *
 * @param {function} next - next middleware to call
 * @param {Object} store - redux store like object
 * @param {Object} apiAction - api action object
 * @param {*} actionPayload - additional action's payload
 *
 * @returns {Promise}
 */
function callApiAction(next, store, apiAction = {}, actionPayload) {
  const {
    method,
    endpointsName,
    endpoint,
  } = apiAction

  const state = store.getState()
  const endpointMethod = state.root.endpoints.getIn([endpointsName, method])

  if (!endpointMethod && !endpoint) {
    next(apiUnknownMethodAction())
    return Promise.reject(new ApiError({
      message: `unknown method ${method} of endpoints ${endpointsName}`,
    }))
  }

  const deviceId = getDeviceId(store.getState())

  const request = createApiRequest(
    method,
    endpointMethod,
    apiAction,
    actionPayload,
    deviceId,
  )

  return apiRequest(
    next,
    store.getState(),
    request,
    store.dispatch
  )
}

export default store => handleErrors(next => action => {
  if (action[AS_API_CALL]) {
    const apiAction = action[AS_API_CALL]

    if (isValidAction(apiAction)) {
      return callApiAction(next, store, apiAction, action.payload)
    } else {
      next(invalidAction())
      return Promise.reject(new ApiError({ message: 'Invalid api action' }))
    }
  } else {
    return next(action)
  }
})
