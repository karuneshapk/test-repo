const IMMUTABLE_MAP = '@@__IMMUTABLE_MAP__@@'

/**
 * Filter out an immutable map collection
 *
 * @param {Immutable.Map} map - the immutable map
 *
 * @param {Array} filterCriterion - the filter criterion.
 *  These criterion specify the keys that should be preserved in a map.
 *
 * Moreover inner maps might be also filtered out. For this an object with
 * the keys and values array for an every key have to be provided in the
 * filter criterion.
 *
 * @return {Immutable.Map}
 */
export const filterImmutableMap = (map, filterCriterion) => {
  if (map && map[IMMUTABLE_MAP] && filterCriterion instanceof Array) {
    const oneLevelDownFilterCriterion = []
    const topLevelFilterCriterion = filterCriterion.filter(element => {
      if (typeof element !== 'string') {
        oneLevelDownFilterCriterion.push(element)
        return false
      } else {
        return true
      }
    })

    let filtered = map.filter((_, key) => topLevelFilterCriterion.includes(key))

    oneLevelDownFilterCriterion.forEach(element =>
      Object.keys(element).forEach(key =>
        filtered = filtered.set(key, filterImmutableMap(map.get(key), element[key]))
      )
    )

    return filtered
  }
}
