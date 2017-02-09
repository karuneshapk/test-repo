import { AS_SHARED_SET, AS_SHARED_RESET } from 'apollo-appstore/constants/actions'
import { Map } from 'immutable'

const initialState = Map({
  modules: Map()
})

/**
 * AppStore Modules Redux subtree reducer
 *
 * @param {Immutable.Map} state - store subtree
 * @param {Object} action - redux action
 *
 * @returns {Immutable.Map} new store subtree
 */
export default (state = initialState, action) => {

  switch (action.type) {

    case AS_SHARED_SET: {
      const payload = action.payload || {}

      const modules = state.get('modules')

      return state.set(
        'modules',
        Object.keys(payload.modules)
          .reduce((state, module) => state.set(module, payload.modules[module]), modules)
      ).set('config', payload.config)
    }

    case AS_SHARED_RESET: {
      return initialState
    }

  }

  return state
}
