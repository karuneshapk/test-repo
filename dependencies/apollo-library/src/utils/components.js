import { removeDuplicates } from './common'
import { Children } from 'react'

/**
 * Control value is in range
 *
 * @param {number} min
 * @param {number} max
 * @param {number} value
 * @return {number}
 */
export const controlRangeValue = (min, max, value) => {
  const parseMin = parseFloat(min)
  const parseMax = parseFloat(max)
  const parseValue = parseFloat(value)

  if (parseValue <= parseMin) {
    return parseMin
  } else if (parseValue >= parseMax) {
    return parseMax
  } else {
    return parseValue
  }
}

/**
 * Compose a single className string from multiple strings
 * @example composeClassName('a', 'b', 'c', 'a') => 'a b c'
 * @perf ~15000ns call + 1ys per argument ( ~0.002ms per call )
 *
 * @param {arguments} set - strings Style class name string
 * @return {string}
 */
export function composeClassName() {
  const classes = []
  const len = arguments.length
  let i = 0

  while (len - i) {
    const cls = arguments[i++]
    if (cls) {
      cls.split(' ').forEach(item => (item !== '') && classes.push(item))
    }
  }
  return removeDuplicates(classes).join(' ')
}

/**
   * Checks if component has children of not
   * @example <div /> => false
   * @example <div>{}</div> => false
   * @example <div>A</div> => true
   * @example <div><span/></div> => true
   *
   * @param {ReactNode} _ - implicit props.children of component
   *
   * @return {boolean}
   */
export const hasChildren = _ =>
  typeof _ === 'string' || typeof _ === 'number' || (Children.count(_) > 0)

/**
 * Map country code code list to select options object
 *
 * @param {Immutable.Map} data Country code code list
 * @return {Array.<{name: string, value: *}>}
 */
export const mapCodelistToOptions = (data, sorted = true) => {
  let optionData = data.map(item => ({
    name: item.get('description'),
    value: item.get('code'),
  }))
  if (sorted) {
    optionData = optionData.sort((a, b) => a.name.localeCompare(b.name))
  }
  return optionData.toArray()
}
