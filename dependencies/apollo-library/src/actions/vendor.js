import { ADDRESS_AUTOCOMPLETE_FINISHED } from 'apollo-library/constants/vendor'

/**
 * Google Autocomplete result retrieved
 *
 * @param {Object} data - data from google API
 *
 * @return {Object} redux action
 */
export const addressAutoCompleteFinished = data => ({
  type: ADDRESS_AUTOCOMPLETE_FINISHED,
  data
})
