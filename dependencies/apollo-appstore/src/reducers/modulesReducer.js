import { Map } from 'immutable'
import { AS_INIT } from 'apollo-appstore/constants/actions'
import {
  AS_MODULE_LOADED,
  AS_MODULE_UNLOADED,
  AS_MODULES_UPDATED,
  AS_MODULES_READY
} from 'apollo-appstore/modules'

const initialState = Map({
  services: Map(),
  environment: Map(),
  apis: Map(),
  loaded: Map(),
  ready: false
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

    case AS_INIT: {
      const {
        environment,
        context,
        services,
        entryModule
      } = action

      return state
        .set('environment', environment)
        .set('context', context)
        .set('entryModule', entryModule)
        .set('services', services.reduce((services, service) => (
          services.set(service.name, service.proxy)
        ), initialState.get('services')))
    }

    case AS_MODULES_UPDATED: {
      return state.set('lastUpdateAt', new Date())
    }

    case AS_MODULES_READY: {
      return state.set('ready', action.payload)
    }

    case AS_MODULE_LOADED: {
      return state.setIn([ 'loaded', action.name ], true)
    }

    case AS_MODULE_UNLOADED: {
      return state
        .deleteIn([ 'apis', action.name ])
        .deleteIn([ 'loaded', action.name ])
    }

  }

  return state
}
