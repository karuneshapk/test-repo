/* global __DEV__ */
import { isEmptyString } from 'apollo-library/utils/common'
import { AS_API_INVALID_ACTION } from '../constants'

/**
 * Invalid action creator
 *
 * @returns {Object} redux action
 */
export const invalidAction = () => ({
  type: AS_API_INVALID_ACTION
})

/**
 * Validates api action.
 *
 * @param {Object} action - api action object
 *
 * @returns {boolean}
 */
const validateAction = action => {
  const validationErrors = []

  if (isEmptyString(action.endpoint)) {
    if (isEmptyString(action.method)) {
      validationErrors.push('[middleware/api validateAction]: method missing')
    }

    if (isEmptyString(action.endpointsName)) {
      validationErrors.push('[middleware/api validateAction]: endpoints name or endpoint missing')
    }
  }

  return validationErrors
}

/**
 * Checks wheter the api action is valid or not.
 *
 * @param {Object} action - api action object
 *
 * @returns {boolean}
 */
export const isValidAction = action => {
  const validationErrors = validateAction(action)
  if (__DEV__ && validationErrors.length) {
    /* eslint-disable no-console */
    console.error(validationErrors)
    /* eslint-enable no-console */
  }
  return !(validationErrors.length)
}

