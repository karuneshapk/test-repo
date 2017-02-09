import { Map, fromJS } from 'immutable'
import { isDefined } from 'apollo-library/utils/common'
import {
  AS_AGENDA_SET,
  AS_AGENDA_SET_KEY,
} from 'apollo-appstore/constants/actions'
import {
  AS_AGENDA_SYSTEM,
  AS_AGENDA_RIGHTS,
} from 'apollo-appstore/constants/agendas'
import { RESET_STORE } from 'apollo-library/constants/actions'

const initialState = Map({
  [AS_AGENDA_SYSTEM]: Map({
    currentContext: undefined
  }),
  [AS_AGENDA_RIGHTS]: Map()
})

const setShared = (state, agenda, key, value) => isDefined(value)
  ? state.hasIn([agenda, key]) && typeof value === 'object'
    ? state.mergeDeepIn([agenda, key], fromJS(value))
    : state.setIn([agenda, key], fromJS(value))
  : state.deleteIn([agenda, key])

/**
 * Shared Agendas Redux subtree reducer
 *
 * @param {Immutable.Map} state - store subtree
 * @param {Object} action - redux action
 *
 * @returns {Immutable.Map} new store subtree
 */
export default (state = initialState, action) => {

  switch (action.type) {

    case AS_AGENDA_SET_KEY: {
      const { key, value, agenda } = action
      return setShared(state, agenda, key, value)
    }

    case AS_AGENDA_SET: {
      const { payload, agenda } = action
      return Map(payload).reduce(
        (state, value, key) => setShared(state, agenda, key, value), state
      )
    }

    case RESET_STORE: {
      return initialState.set(AS_AGENDA_SYSTEM, state.get(AS_AGENDA_SYSTEM))
    }
  }

  return state
}
