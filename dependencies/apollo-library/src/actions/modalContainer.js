import {
  MODAL_SHOW,
  MODAL_HIDE
} from 'apollo-library/constants/actions'

/**
 * Show modal
 *
 * @param {*} content - modal content
 *
 * @return {Object} redux action
 */
export const showModal = content => ({
  type: MODAL_SHOW,
  content
})

/**
 * Show modal
 *
 * @return {Object} redux action
 */
export const hideModal = () => ({
  type: MODAL_HIDE
})
