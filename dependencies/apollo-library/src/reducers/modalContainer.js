import {
  MODAL_SHOW,
  MODAL_HIDE,
  RESET_STORE,
} from 'apollo-library/constants/actions'

/**
 * Redux data transformer for modal container
 *
 * @param {boolean} state - redux subtree store state
 * @param {Object} action - redux action to be processed
 *
 * @return {Immutable.Map} new (transformed) redux state
 */
export const modalContainerReducer = (state = false, action) => {

  switch (action.type) {

    case MODAL_SHOW: {
      return action.content
    }

    case RESET_STORE:
    case MODAL_HIDE:
      return false

  }

  return state
}
