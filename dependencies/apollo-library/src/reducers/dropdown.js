import { Map } from 'immutable'

import { DROPDOWN_OPEN } from 'apollo-library/constants/actions'

const initialState = Map({
  dropdownId: ''
})

/**
 * Redux data transformer for dropdown container
 *
 * @param {Immutable.Map} state - redux subtree store state
 * @param {Object} action - redux action to be processed
 *
 * @return {Immutable.Map} new (transformed) redux state
 */
export const dropdownReducer = (state = initialState, action) => {

  switch (action.type) {

    case DROPDOWN_OPEN: {
      return state.set('dropdownId', action.dropdownId)
    }

  }

  return state
}
