import { Map } from 'immutable'

import { SET_ACTIVE_TAB } from 'apollo-library/constants/actions'

const initialState = Map()

/**
 * Redux data transformer for tab container
 *
 * @param {Immutable.Map} state - redux subtree store state
 * @param {Object} action - redux action to be processed
 *
 * @return {Immutable.Map} new (transformed) redux state
 */
export const tabComponentReducer = (state = initialState, action) => {

  switch (action.type) {

    case SET_ACTIVE_TAB: {
      return handleSetActiveTab(state, action.payload)
    }

  }

  return state
}

/**
 * Handle setting a new active tab
 *
 * @param {Immutable.Map} state - redux subtree store state
 * @param {Object} payload - a current payload
 *
 * @return {Immutable.Map} new (transformed) redux state
 */
const handleSetActiveTab = (state, payload = {}) =>
  state.mergeIn([ payload.componentName ], { activeTab: payload.activeTab })

