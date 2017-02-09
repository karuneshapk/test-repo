import { Map, List } from 'immutable'

import {
  NAVIGATION_DROPDOWN_OPEN,
  NAVIGATION_DROPDOWN_CLOSE,
  NAVIGATION_DROPDOWN_SET_ACTIVE,
  NAVIGATION_DROPDOWN_SET_TITLE,
  NAVIGATION_MENU_SET_ITEMS,
  NAVIGATION_MENU_SET_ACTIVE,
} from 'apollo-library/constants/actions'

const initialState = Map({
  dropdown: Map({
    open: Map(),
    active: Map(),
    titles: Map(),
  }),
  bar: Map({
    items: List(),
  })
})

/**
 * Redux data transformer for dropdown container
 *
 * @param {Immutable.Map} state - redux subtree store state
 * @param {Object} action - redux action to be processed
 *
 * @return {Immutable.Map} new (transformed) redux state
 */
export const navigationReducer = (state = initialState, action) => {

  switch (action.type) {

    case NAVIGATION_DROPDOWN_OPEN:
      return state.setIn(['dropdown', 'open', action.dropdownId], true)

    case NAVIGATION_DROPDOWN_CLOSE:
      return state.deleteIn(['dropdown', 'open', action.dropdownId])

    case NAVIGATION_DROPDOWN_SET_ACTIVE:
      return state.setIn(['dropdown', 'active', action.dropdownId], action.itemId)

    case NAVIGATION_DROPDOWN_SET_TITLE:
      return state.setIn(['dropdown', 'titles', action.dropdownId], action.title)

    case NAVIGATION_MENU_SET_ITEMS:
      return state.setIn(['menu', 'items'], action.items)

    case NAVIGATION_MENU_SET_ACTIVE:
      return state.setIn(['menu', 'activeItem'], action.item)

  }

  return state
}

