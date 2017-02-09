/* global __DEV__  */
import masks from './masks'

/**
 * Applies a single mask to a value.
 *
 * @param {string|undefined} value - field value
 * @param {string|Object} fieldMask - single mask/mask name
 *
 * @return {Object}
 */
function applyMask(value, fieldMask, ...args) {
  if (typeof fieldMask === 'function') {
    return fieldMask(value, ...args)
  }

  if (typeof masks[fieldMask] === 'function') {
    return masks[fieldMask](value, ...args)
  }

  if (typeof fieldMask === 'object' && fieldMask.mask) {
    const mask = fieldMask.mask
    const maskArgs = fieldMask.args

    if (typeof mask === 'function') {
      return mask.call(null, value, ...maskArgs, ...args)
    }

    if (typeof masks[mask] === 'function') {
      return masks[mask].call(null, value, ...maskArgs, ...args)
    }
  }

  if (__DEV__) {
    /* eslint-disable no-console */
    console.error(`${fieldMask} is not a valid mask.
      You probably misspelled its name, or it's in the wrong format`)
    /* eslint-enable no-console */
  }

  return value
}

/**
 * Calls a function to apply a mask or an array of masks to a value.
 *
 * @param {string|Object|Array} fieldMasks - single mask/mask name
 * or a list of masks/mask names
 * @param {Object} event - change event
 *
 * @return {function}
 */
export default function(fieldMasks, event, ...args) {
  
  if (!fieldMasks) {
    return value
  }

  var value, caretPosition

  if (typeof event === 'object') {
    const target = event.currentTarget
    value = target.value
    caretPosition = target.selectionEnd
  } else {
    value = event
  }

  const result = do {
    if (Array.isArray(fieldMasks)) {
      fieldMasks.reduce((reduced, current) =>
        applyMask(reduced, current, caretPosition, ...args, event)
      , value)
    } else {
      applyMask(value, fieldMasks, caretPosition, ...args, event)
    }
  }

  if (caretPosition === result.caretPosition && typeof event === 'object') {
    event.preventDefault()
  }

  return result
}
