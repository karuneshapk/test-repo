import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

import { filterDOMNodeProps } from 'apollo-library/utils/props'
import { CLASS_PREFIXES } from 'apollo-library/constants/components'
import { isNatural } from 'apollo-library/utils/math'
import { composeClassName } from 'apollo-library/utils/components'

/**
 * Element Grid Column
 *
 * @property {Number} lg - The number of columns you wish to span for Large
 *   devices Desktops (≥1200px)
 * @property {Number} lgOffset - Move columns to the right for Large devices
 *   Desktops
 * @property {Number} lgPull - Change the order of grid columns to the left for
 *   Large devices Desktops
 * @property {Number} lgPush - Change the order of grid columns to the right for
 *   Large devices Desktops
 * @property {Number} md - The number of columns you wish to span for Medium
 *   devices Desktops (≥992px)
 * @property {Number} mdOffset - Move columns to the right for Medium devices
 *   Desktops
 * @property {Number} mdPull - Change the order of grid columns to the left for
 *   Medium devices Desktops
 * @property {Number} mdPush - Change the order of grid columns to the right for
 *   Medium devices Desktops
 * @property {Number} sm - The number of columns you wish to span for Small
 *   devices Tablets (≥768px)
 * @property {Number} smOffset - Move columns to the right for Small devices
 *   Tablets
 * @property {Number} smPull - Change the order of grid columns to the left for
 *   Small devices Tablets
 * @property {Number} smPush - Change the order of grid columns to the right for
 *   Small devices Tablets
 * @property {Number} xs - The number of columns you wish to span for Extra
 *   small devices Phones (<768px)
 * @property {Number} xsOffset - Move columns to the right for Extra small
 *   devices Phones
 * @property {Number} xsPull - Change the order of grid columns to the left for
 *   Extra small devices Phones
 * @property {Number} xsPush - Change the order of grid columns to the right for
 *   Extra small devices Phones
 *
 * @module
 */
export class Col extends Component {

  static propTypes = {
    ...Map(CLASS_PREFIXES).map(() => {
      return PropTypes.number
    }).toJS(),
    fullGrid: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    fullGrid: true,
    ...Map(CLASS_PREFIXES).map(() => {
      return 0
    }).toJS()
  }

  /**
   * Generate class names form map and props
   *
   * @param {Object} props
   * @return {Array}
   */
  generatePrefixedClasses(props) {
    var classPrefixes = Map(CLASS_PREFIXES)

    classPrefixes = classPrefixes.map((className, key) =>
      isNatural(props[key])
        ? (className + props[key])
        : false
    )

    return classPrefixes.toArray()
  }

  /**
   * Col component renderer
   *
   * @return {ReactNode}
   */
  render() {
    const {
      className,
      children,
      ...props
    } = this.props

    const classes = composeClassName(
      ...this.generatePrefixedClasses(props),
      className
    )

    return (
      <div className={classes} {...filterDOMNodeProps(props)}>
        {children}
      </div>
    )
  }

}

export default Col
