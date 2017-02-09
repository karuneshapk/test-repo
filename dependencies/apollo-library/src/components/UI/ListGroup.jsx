import React, { Component, PropTypes } from 'react'

import { composeClassName } from 'apollo-library/utils/components'
import { filterDOMNodeProps } from 'apollo-library/utils/props'

/**
 * Bootstrap list group component
 * Can be like div or ul element
 *
 * @property {boolean} list Swich between ul or div element Default false (div)
 *
 * @module
 */
export class ListGroup extends Component {

  static propTypes = {
    list: PropTypes.bool
  }

  static defaultProps = {
    list: false
  }

  /**
   * Render bootstrap list group component
   *
   * @return {ReactNode}
   */
  render() {
    const {
      list,
      className,
      children,
      ...props
    } = this.props

    var classes = composeClassName('list-group', className)
    const elementProps = filterDOMNodeProps(props)

    if (list) {
      return (
        <ul className={classes} {...elementProps}>
          {children}
        </ul>
      )
    } else {
      return (
        <div className={classes} {...elementProps}>
          {children}
        </div>
      )
    }
  }

}

export default ListGroup
