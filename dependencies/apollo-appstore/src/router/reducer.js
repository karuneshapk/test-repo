import { Map } from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'
import {
  AS_SET_ROUTES,
  AS_ROUTER_UPDATED,
  AS_ROUTER_RESET,
} from './actions'

const initialState = Map({
  needsUpdate: false
})

/**
 * Sets needsUpdate flag for router state
 *
 * @param {Immutable.Map} state - reducer's state
 * @param {boolean} needsUpdate - whether router should update or not
 *
 * @returns {Immutable.Map}
 */
const setNeedsUpdate = (state, needsUpdate = true) => state.set('needsUpdate', needsUpdate)

/**
 * Module router's reducer
 *
 * @param {Immutable.Map} state - state for this reducer
 * @param {Object} action - redux action
 *
 * @returns {Immutable.Map}
 */
export default (state = initialState, action) => {

  switch (action.type) {

    case AS_SET_ROUTES: {
      return setNeedsUpdate(
        state.set('routes', action.routes)
      )
    }

    case LOCATION_CHANGE: {
      const routes = state.get('routes')

      // when we want to change the url without updating the router state
      // we call "push" or "replace" with location object
      // and set the property "silentUpdate" in its "state" property to true
      const silentUpdate = action.payload.state
        && typeof action.payload.state === 'object'
        && action.payload.state.silentUpdate

      return routes && !silentUpdate ? setNeedsUpdate(state) : state
    }

    case AS_ROUTER_UPDATED: {
      return setNeedsUpdate(state, false)
    }

    case AS_ROUTER_RESET: {
      return initialState
    }

  }

  return state
}
