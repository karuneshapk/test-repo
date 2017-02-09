import { Map, fromJS } from 'immutable'
import {
  AS_GET_CODELIST_REQUEST,
  AS_GET_CODELIST_SUCCESS
} from 'apollo-appstore/constants/actions'

const initialState = fromJS({
  lists: {},
  queue: {}
})

/**
 * Shared Agendas Redux subtree reducer
 *
 * @param {Immutable.Map} state - store subtree
 * @param {Object} action - redux action
 *
 * @returns {Immutable.Map} new store subtree
 */
export default (state = initialState, {type, payload, service}) => {

  if (type === AS_GET_CODELIST_REQUEST) {
    return state.setIn(['queue', service], true)
  }


  if (type === AS_GET_CODELIST_SUCCESS) {
    var codelists = state.get('lists')

    codelists = codelists.set(service, Map(payload).reduce((accu, data, codelist) => {
      return accu.set(codelist, fromJS(data.data))
    }, state.get(service, Map())))

    state = state.set('queue', state.get('queue').delete(service))
    return state.mergeDeepIn(['lists'], codelists)
  }

  return state
}
