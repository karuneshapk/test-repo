import React from 'react'
import { Iterable } from 'immutable'

/**
 * Returns object in structure by keys hierarchy
 *
 * @param {Object} obj
 * @param {Array<string>} keys
 * @param {boolean} [create=false]
 * @returns {*}
 */
export const getObjectKey = (obj, keys, create = false) => {

  if (!keys || !obj) {
    if (create) {
      return {}
    } else {
      return null
    }
  }

  let node = obj

  while(keys.length) {
    const currentPart = keys.shift()

    if (!node[currentPart]) {
      if (create) {
        node[currentPart] = {}
      } else {
        return null
      }
    }

    node = node[currentPart]
  }

  return node
}

/**
 * Returns value located at path in obj structure
 * @param {Object} obj
 * @param {string} path
 * @returns {*}
 */
export const getObjectKeyByPath = (obj, path) => {
  const keyParts = path.split('.')

  return getObjectKey(obj, keyParts)
}

/**
 * Sets value for given path in object's structure
 * @param {Object} obj
 * @param {string} path
 * @param {*} value
 * @returns {object}
 */
export const setObjectAtKeyPath = (obj, path, value) => {
  const keyParts = path.split('.')
  const lastKey = keyParts.pop()

  const rootNode = {}
  let node = rootNode

  while(keyParts.length) {
    const currentPart = keyParts.shift()

    node[currentPart] = {}
    node = node[currentPart]
  }

  node[lastKey] = value

  return deepMerge(obj, rootNode)
}

/**
 * Check if the argument is an object,
 * but not array, React.Element, or Immutable.Iterable
 *
 * @param {Object} obj
 * @returns {boolean}
 */
export const isPlainObject = obj => {
  return typeof obj === 'object'
    && !Array.isArray(obj)
    && !React.isValidElement(obj)
    && !Iterable.isIterable(obj)
}

/**
 * Merges second argument object into first one
 * Completely overides old value if new value is not a plain object
 *
 * @param {Object} obj
 * @param {Object} updates
 * @returns {Object}
 */
export const deepMerge = (obj, updates) => {
  if (!isPlainObject(obj) || !isPlainObject(updates)) {
    return obj
  }

  const copy = deepClone(obj)

  for (const prop in updates) {
    if (updates.hasOwnProperty(prop)) {
      const propValue = updates[prop]

      if (!copy.hasOwnProperty(prop)
          || !isPlainObject(propValue)
      ) {
        copy[prop] = propValue
      } else {
        copy[prop] = deepMerge(copy[prop], updates[prop])
      }
    }
  }

  return copy
}

/**
 * Deep clones an object
 * Immutable.Iterables and React.Elements are copied as-is, without deep cloning
 *
 * @param {Object} obj
 * @returns {Object}
 */
export const deepClone = obj => {
  if (React.isValidElement(obj)
      || Iterable.isIterable(obj)) {
    return obj
  }

  const copy = {}

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const propValue = obj[prop]

      if (typeof propValue === 'object'
          && !React.isValidElement(propValue)
          && !Iterable.isIterable(propValue)) {
        copy[prop] = deepClone(propValue)
      } else {
        copy[prop] = propValue
      }
    }
  }

  return copy
}
