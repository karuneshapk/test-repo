import {
  AS_SHARED_SET,
  AS_SHARED_RESET
} from 'apollo-appstore/constants/actions'

/**
 * Reset all agendas
 *
 * @returns {Object} redux action
 */
export const resetShared = () => ({
  type: AS_SHARED_RESET
})

/**
 * Update module's shared data
 *
 * @param {Object} payload - merged shared data for mounted modules
 *
 * @returns {Object} redux action
 */
export const setShared = payload => ({
  type: AS_SHARED_SET,
  payload
})
