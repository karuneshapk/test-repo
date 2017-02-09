import { Map } from 'immutable'

import { AS_ENDPOINTS_NAME } from '../constants/endpoints'
import { AS_REGISTER_ENDPOINTS } from '../constants/actions'

import endpoints from '../endpoints'

const initialState = Map({
  [AS_ENDPOINTS_NAME]: Map(endpoints),
})

/**
 * Endpoints reducer
 *
 * @param {Immutable.Map} state - store subtree
 * @param {Object} action - redux action
 *
 * @returns {Immutable.Map} new store subtree
 */
export default (state = initialState, action) => {

  switch (action.type) {

    case AS_REGISTER_ENDPOINTS: {
      const { endpointsName, endpoints } = action
      return state.set(endpointsName, Map(endpoints))
    }
  }

  return state
}
